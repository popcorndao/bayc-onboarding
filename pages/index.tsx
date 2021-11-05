import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import Navbar from "components/NavBar";
import { connectors } from "context/Web3/connectors";
import { ContractContext } from "context/Web3/contracts";
import { Contract } from "ethers";
import router from "next/router";
import { useContext, useEffect } from "react";
import checkApe from "utils/checkApe";

export default function Index(): JSX.Element {
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
  const { contract } = useContext(ContractContext);

  useEffect(() => {
    if (!account || !contract) {
      return;
    }
    checkApe(contract, account).then((hasApe) =>
      hasApe ? router.push("/beneficiaries") : router.push("/error")
    );
  }, [account]);

  return (
    <div className="w-full h-screen bg-white overflow-hidden">
      <Navbar />
      <div className="z-10 relative flex justify-center mt-16">
        <div className="flex flex-col w-1/3 mt-8">
          <img src="/images/hero.png" alt="hero" className="" />
          <p className="text-xl mt-8 text-gray-900 font-light text-center">
            This airdrop sends 100 $POP to your wallet and 100 $POP to the
            charities you select. Your airdropped tokens are locked until $POP
            staking 2022). Simply verify BAYC charity allocations, and await
            your airdrop. In meantime, join us in Discord and follow us
            @Popcorn_DAO.
          </p>
          <button
            className="w-48 py-4 px-5 mt-8 flex flex-row items-center justify-center rounded-xl mx-auto bg-blue-600 hover:bg-blue-700"
            onClick={() => activate(connectors.Injected)}
          >
            <p className="text-lg text-white font-semibold">Connect Wallet</p>
          </button>
        </div>
      </div>
      <img src="/images/landingBG.svg" className="absolute bottom-0 z-0" />
    </div>
  );
}
