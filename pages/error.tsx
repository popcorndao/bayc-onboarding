import Navbar from "components/NavBar";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.replace(window.location.pathname);
    }
  }, [router.pathname]);

  return (
    <div className="w-full h-screen bg-primaryLight overflow-hidden">
      <Navbar />
      <div className="w-full text-center z-20 mt-24 md:mt-8 xl:mt-14 2xl:mt-24">
        <h1 className="text-4xl md:text-5xl 2xl:text-7xl font-medium md:w-1/2 2xl:w-5/12 text-center mx-auto">
          Sorry, we encountered an error...
        </h1>
        <div className="z-20 mx-auto w-10/12 md:w-1/2 justify-center flex">
          <div className="flex flex-row">
            <p className="mt-4 xl:mt-8 text-2xl 2xl:text-4xl font-light z-20">
              Follow our
              <a
                className="font-normal text-2xl 2xl:text-4xl cursor-pointer z-20 mt-8 mx-2"
                href="https://discord.gg/RN4VGqPDwX"
                target="_blank"
              >
                Discord
              </a>{" "}
              and
              <a
                className="font-normal text-2xl 2xl:text-4xl cursor-pointer z-20 mt-8 mx-2"
                href="https://twitter.com/popcorn_DAO"
                target="_blank"
              >
                Twitter
              </a>{" "}
              for the next drop!
            </p>
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
