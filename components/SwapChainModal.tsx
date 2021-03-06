import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect } from 'react';
import { setSingleActionModal } from '../context/actions';
import { store } from '../context/store';
import { networkMap } from '../context/Web3/connectors';

const SwapChainModal: React.FC = () => {
  const context = useWeb3React<Web3Provider>();
  const { account, chainId } = context;
  const { dispatch } = useContext(store);

  useEffect(() => {
    if (account && chainId !== Number(process.env.CHAIN_ID)) {
      dispatch(
        setSingleActionModal({
          content: `The network selected in your wallet is not supported. Please switch to ${
            networkMap[Number(process.env.CHAIN_ID)]
          }.`,
          title: 'Network Error',
          visible: true,
          type: 'error',
          onConfirm: {
            label: 'Close',
            onClick: () => dispatch(setSingleActionModal(false)),
          },
        }),
      );
    }
  }, [chainId, account]);

  return <></>;
};
export default SwapChainModal;
