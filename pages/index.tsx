import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import Navbar from "components/NavBar";
import { connectors } from "context/Web3/connectors";
import { ContractContext } from "context/Web3/contracts";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import checkApe from "utils/checkApe";
import EVENT_END from "utils/eventEnd";

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
  const [countdown, setCountdown] = useState<number[]>([]);
  const [countdownActive, disableCountdown] = useState<boolean>(true);

  useEffect(() => {
    if (!account || !contract) {
      return;
    }
    checkApe(contract, account).then((hasApe) =>
      hasApe ? router.push("/beneficiaries") : router.push("/error")
    );
  }, [account]);

  setInterval(function () {
    const now = new Date().getTime();

    const distance = EVENT_END.getTime() - now;
    if (distance < 0) {
      disableCountdown(false);
      setCountdown([0, 0, 0, 0]);
    }

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setCountdown([days, hours, minutes, seconds]);
  }, 1000);

  return (
    <div className="w-full h-screen bg-white overflow-hidden">
      <Navbar />
      <div className="z-10 relative flex justify-center mt-16">
        <div className="flex flex-col w-1/3 mt-8">
          <img src="/images/hero.png" alt="hero" className="" />
          <p className="text-xl mt-8 text-gray-900 font-light text-center 2xl:mt-24 2xl:text-3xl">
            This airdrop sends 100 $POP to your wallet and 100 $POP to the
            charities you select. Your airdropped tokens are locked until $POP
            staking 2022). Simply verify BAYC charity allocations, and await
            your airdrop. In meantime, join us in{" "}
            <a
              className="font-normal cursor-pointer"
              href="https://discord.gg/RN4VGqPDwX"
              target="_blank"
            >
              Discord
            </a>{" "}
            and follow us on{" "}
            <a
              className="font-normal cursor-pointer"
              href="https://twitter.com/popcorn_DAO"
              target="_blank"
            >
              Twitter
            </a>
          </p>
          <button
            className="w-48 2xl:w-60 py-4 px-5 mt-8 2xl:mt-16 flex flex-row items-center justify-center rounded-xl mx-auto bg-blue-600 hover:bg-blue-700"
            onClick={() => activate(connectors.Injected)}
          >
            <p className="text-lg text-white font-semibold 2xl:text-2xl">
              Connect Wallet
            </p>
          </button>
          <div className="w-9/12 mx-auto z-20 mt-12">
            <div className="flex flex-row justify-evenly">
              <div className="text-center">
                <h1 className="font-medium text-5xl leading-snug">
                  {countdown[0]}
                </h1>
                <p className="text-2xl font-landing not-italic text-gray-800">Days</p>
              </div>
              <div className="text-center">
                <h1 className="font-medium text-5xl leading-snug">
                  {countdown[1]}
                </h1>
                <p className="text-2xl font-landing not-italic text-gray-800">Hours</p>
              </div>
              <div className="text-center">
                <h1 className="font-medium text-5xl leading-snug">
                  {countdown[2]}
                </h1>
                <p className="text-2xl font-landing not-italic text-gray-800">Minutes</p>
              </div>
              <div className="text-center">
                <h1 className="font-medium text-5xl leading-snug">
                  {countdown[3]}
                </h1>
                <p className="text-2xl font-landing not-italic text-gray-800">Seconds</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <img
        src="/images/landingBG.svg"
        className="absolute bottom-0 z-0 w-full"
      />
    </div>
  );
}
