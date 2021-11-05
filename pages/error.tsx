import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import Navbar from "components/NavBar";
import { ContractContext } from "context/Web3/contracts";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

const ErrorPage = () => {
  const router = useRouter();
  const context = useWeb3React<Web3Provider>();
  const { contract } = useContext(ContractContext);
  const { library, account, activate, active } = context;

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.replace(window.location.pathname);
    }
  }, [router.pathname]);

  return (
    <div className="w-full h-screen bg-primaryLight overflow-hidden">
      <Navbar />
      <div className="w-full text-center mt-14 z-20 2xl:mt-40">
        <h1 className="text-5xl font-medium w-1/2 text-center mx-auto">
          Sorry, you need a Bored Ape for this airdrop...
        </h1>
        <div className="z-20 mx-auto w-1/2 justify-center flex">
          <div className="flex flex-row">
            <p className="mt-8 text-2xl font-light">Follow our</p>
            <a
              className="font-normal text-2xl cursor-pointer z-20 mt-8 mx-2"
              href="https://discord.gg/RN4VGqPDwX"
            >
              Discord
            </a>{" "}
            <p className="mt-8 text-2xl font-light">and</p>
            <a
              className="font-normal text-2xl cursor-pointer z-20 mt-8 mx-2"
              href="https://discord.gg/RN4VGqPDwX"
            >
              Twitter
            </a>{" "}
            <p className="mt-8 text-2xl font-light">for the next drop!</p>
          </div>
        </div>
      </div>
      <img
        src="/images/errorBackground.svg"
        alt="bgError"
        className="absolute bottom-0 -z-10 w-full"
      />
    </div>
  );
};

export default ErrorPage;
