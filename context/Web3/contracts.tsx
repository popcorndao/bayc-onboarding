import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { Contract } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import getRequiredAddresses from "utils/getRequiredAddresses";
import baycAbi from "../../utils/baycAbi.json";
import { setSingleActionModal } from "../actions";
import { store } from "../store";
import { connectors, networkMap } from "./connectors";
import merkleOrchardAbi from "../../utils/merkleOrchardAbi.json";


interface Contracts{
  bayc:Contract;
  merkleOrchard:Contract;
}

interface ContractContext {
  contracts: Contracts;
  setContracts: React.Dispatch<Contracts>;
}

export const ContractContext = createContext<ContractContext>(null);

interface ContractsWrapperProps {
  children: React.ReactNode;
}

function getErrorMessage(error: Error) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return `You're connected to an unsupported network. Please connect to ${
      networkMap[Number(process.env.CHAIN_ID)]
    }.`;
  } else if (error instanceof UserRejectedRequestErrorInjected) {
    return "Please authorize this website to access your Ethereum account.";
  } else {
    console.error(error);
    return "An unknown error occurred. Check the console for more details.";
  }
}

export default function ContractsWrapper({
  children,
}: ContractsWrapperProps): JSX.Element {
  const context = useWeb3React<Web3Provider>();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;
  const [contracts, setContracts] = useState<Contracts>();
  const { dispatch } = useContext(store);

  useEffect(() => {
    if (!active) {
      activate(connectors.Network);
    }
  }, [active]);

  useEffect(() => {
    if (error) {
      dispatch(
        setSingleActionModal({
          content: getErrorMessage(error),
          title: "Wallet Error",
          visible: true,
          type: "error",
          onConfirm: {
            label: "Close",
            onClick: () => dispatch(setSingleActionModal(false)),
          },
        })
      );
    }
  }, [error]);

  useEffect(() => {
    if (!library) {
      return;
    }
    setContracts({
      bayc: new Contract(
        "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        baycAbi,
        library
      ),
      merkleOrchard: new Contract(
        getRequiredAddresses(networkMap[process.env.CHAIN_ID]).merkleOrchard,
        merkleOrchardAbi,
        library
      ),
    });
  }, [library, active]);

  return (
    <ContractContext.Provider
      value={{
        contracts,
        setContracts,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
}
