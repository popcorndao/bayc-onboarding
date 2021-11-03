import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React from "react";
import { connectors } from "../context/Web3/connectors";

const Navbar: React.FC = () => {
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

  return (
    <nav className="flex shadow-md py-3 px-14 bg-white">
      <div className="w-full flex flex-row items-center justify-between">
        <div></div>
        <button
          className="w-28 p-1 flex flex-row items-center justify-center border border-gray-400 rounded hover:bg-indigo-400 hover:text-white"
          onClick={() => activate(connectors.Injected)}
        >
          <p>Connect{account && "ed"}</p>
          {account && (
            <div className="w-2 h-2 bg-green-400 rounded-full ml-2" />
          )}
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
