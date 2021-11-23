import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "context/Web3/connectors";
import { Step } from "pages";
import { Dispatch } from "react";

interface MetamaskStepProps {
  isActive: boolean;
  setStep: Dispatch<Step>;
  availableSlots: number;
  maxSlots: number;
  activate:Function;
}

export default function MetamaskStep({
  isActive,
  setStep,
  availableSlots,
  maxSlots,
  activate
}: MetamaskStepProps): JSX.Element {
  return (
    isActive && (
      <>
        <div className="flex flex-row items-center mx-auto mt-6 xl:mt-10 2xl:mt-14">
          <div className="rounded-full w-8 xl:w-12 2xl:w-16 h-8 xl:h-12 2xl:h-16 border-2 border-gray-800 flex justify-center items-center">
            <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold">1</p>
          </div>
          <img src={`/images/arrowGray.svg`} className="mx-2" />
          <div
            className={`rounded-full w-8 xl:w-12 2xl:w-16 h-8 xl:h-12 2xl:h-16 border-2 flex justify-center items-center
            border-gray-500`}
          >
            <p
              className={`text-lg xl:text-xl 2xl:text-2xl font-semibold text-gray-500`}
            >
              2
            </p>
          </div>
        </div>
        <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold mx-auto text-center xl:w-1/3 mt-8 2xl:mt-12">
          Step 1: Connect with Metamask
        </p>
        <button
          className="w-48 2xl:w-60 py-2 xl:py-4 px-5 mt-5 2xl:mt-6 flex flex-row items-center justify-center rounded-xl mx-auto bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            activate(connectors.Injected);
            setStep(Step.Beneficiary);
          }}
        >
          <p className="text-lg text-white font-semibold 2xl:text-2xl">
            Connect Wallet
          </p>
        </button>
        <p className="text-xl xl:text-3xl 2xl:text-4xl font-semibold text-center">
          {availableSlots}/{maxSlots} Left
        </p>
      </>
    )
  );
}
