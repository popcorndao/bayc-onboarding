import { Web3Provider } from "@ethersproject/providers";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useWeb3React } from "@web3-react/core";
import { DefaultSingleActionModalProps } from "components/Modal/SingleActionModal";
import Navbar from "components/NavBar";
import { setSingleActionModal } from "context/actions";
import { store } from "context/store";
import { connectors } from "context/Web3/connectors";
import { ContractContext } from "context/Web3/contracts";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import checkApe from "utils/checkApe";
import airdrop from "../public/airdrop.json";
enum Step {
  Wallet,
  Email,
  End,
}

enum Phase {
  SignUp,
  Claim,
}

interface RegisteredContacts {
  addresses: string[];
  emails: string[];
}

const MAX_SLOTS = 500;
const PHASE = Phase.SignUp;

async function checkAvailableSlots(supabase: SupabaseClient): Promise<number> {
  const ids = (await supabase.from("Apes").select("id")) || ({} as any);

  if (!ids.data) {
    return MAX_SLOTS;
  }

  return MAX_SLOTS - Object.keys(ids.data).length;
}

async function getRegisteredContacts(
  supabase: SupabaseClient
): Promise<RegisteredContacts> {
  const registered =
    (await supabase.from("Apes").select("address,email")) || ({} as any);

  if (!registered.data) {
    return { addresses: [], emails: [] };
  }

  return {
    addresses: registered.data.map((item) => item["address"]),
    emails: registered.data.map((item) => item["email"]),
  };
}

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
  const { contracts } = useContext(ContractContext);
  const { dispatch } = useContext(store);
  const [availableSlots, setAvailableSlots] = useState<number>(MAX_SLOTS);
  const [registeredContacts, setRegisteredContacts] =
    useState<RegisteredContacts>({ addresses: [], emails: [] });
  const [ethAddress, setEthAddress] = useState<string>("");
  const [step, setStep] = useState<Step>(Step.Wallet);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }
    if (PHASE === Phase.SignUp) {
      checkAvailableSlots(supabase).then((res) => setAvailableSlots(res));
      getRegisteredContacts(supabase).then((res) => setRegisteredContacts(res));
    }
  }, [supabase]);

  useEffect(() => {
    if (!account || !contracts) {
      return;
    }
    if (PHASE === Phase.SignUp) {
      if (registeredContacts.addresses.includes(account)) {
        router.push("/alreadyRegistered");
      } else {
        checkApe(contracts.bayc, account).then(
          (hasApe) => !hasApe && router.push("/noApe")
        );
        setEthAddress(account);
      }
    } else {
      Object.keys(airdrop).includes(account)
        ? router.push("/beneficiaries")
        : router.push("/notFastEnough");
    }
  }, [account]);

  async function addApe(): Promise<void> {
    const message = await library
      .getSigner()
      .signMessage("By signing this message, I verify I own this address");
    if (message) {
      try {
        await supabase.from("Apes").insert([
          {
            address: ethAddress,
            email: email,
          },
        ]);
        setSubmitSuccess(true);
      } catch (error) {
        console.log("error", error);
      }
    } else {
      dispatch(
        setSingleActionModal({
          content: `You have to sign the message to verify ownership of the address`,
          title: "Error",
          visible: true,
          type: "error",
          onConfirm: {
            label: "Ok",
            onClick: () =>
              dispatch(
                setSingleActionModal({ ...DefaultSingleActionModalProps })
              ),
          },
        })
      );
    }
    setStep(Step.End);
  }

  return (
    <div className="w-full h-screen bg-primary overflow-hidden">
      <Navbar />
      <div className="z-10 relative flex justify-center mt-8 xl:mt-16 2xl:mt-24">
        <div className="flex flex-col w-full md:w-2/3 lg:w-1/3 mt-4">
          <img
            src="/images/hero.png"
            alt="hero"
            className="w-9/12 xl:w-full mx-auto"
          />
          <h2 className="mx-auto text-center mt-8 w-9/12 text-2xl md:hidden">This site is not available on mobile...</h2>
          <div className="hidden md:flex flex-col">
            <p className="text-lg xl:text-xl 2xl:text-3xl mt-8 2xl:mt-12 text-gray-900 font-light text-center">
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
            {PHASE === Phase.SignUp ? (
              <>
                {step === Step.End ? (
                  <>
                    {submitSuccess ? (
                      <div>
                        <p className="text-2xl 2xl:text-4xl text-center mt-8">
                          Congratulations!
                        </p>
                        <p className="text-xl 2xl:text-3xl text-gray-900 font-light text-center mt-2">
                          You are in! We will send you an email in a few days
                          once the airdrop is ready.
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-2xl 2xl:text-4xl text-center mt-8">
                          Oops...
                        </p>
                        <p className="text-xl 2xl:text-3xl text-gray-900 font-light text-center">
                          There was an error... Please try again.
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-row items-center mx-auto mt-6 xl:mt-10 2xl:mt-14">
                      <div className="rounded-full w-8 xl:w-12 2xl:w-16 h-8 xl:h-12 2xl:h-16 border-2 border-gray-800 flex justify-center items-center">
                        <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold">
                          1
                        </p>
                      </div>
                      <img
                        src={`/images/${
                          step === Step.Wallet
                            ? "arrowGray.svg"
                            : "arrowBlack.svg"
                        }`}
                        className="mx-2"
                      />
                      <div
                        className={`rounded-full w-8 xl:w-12 2xl:w-16 h-8 xl:h-12 2xl:h-16 border-2 flex justify-center items-center ${
                          step === Step.Wallet
                            ? "border-gray-500"
                            : "border-black"
                        }`}
                      >
                        <p
                          className={`text-lg xl:text-xl 2xl:text-2xl font-semibold ${
                            step === Step.Wallet
                              ? "text-gray-500"
                              : "text-black"
                          }`}
                        >
                          2
                        </p>
                      </div>
                    </div>
                    <p className="text-lg xl:text-xl 2xl:text-2xl font-semibold text-center mt-8 2xl:mt-12">
                      {step === Step.Wallet
                        ? "Step 1: Connect with Metamask"
                        : "Step 2: Enter your Email for the airdrop notification"}
                    </p>
                    {step === Step.Wallet ? (
                      <button
                        className="w-48 2xl:w-60 py-2 xl:py-4 px-5 mt-5 2xl:mt-6 flex flex-row items-center justify-center rounded-xl mx-auto bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          activate(connectors.Injected);
                          setStep(Step.Email);
                        }}
                      >
                        <p className="text-lg text-white font-semibold 2xl:text-2xl">
                          Connect Wallet
                        </p>
                      </button>
                    ) : (
                      <>
                        {account && (
                          <>
                            <div className="relative z-20 mx-auto mt-5 shadow-lg bg-white rounded-xl py-2 px-2 w-10/12 2xl:w-8/12 flex flex-row items-center justify-between">
                              <input
                                type="email"
                                name="email"
                                className="w-10/12 p-2 border-none text-base mx-2 text-gray-900"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => {
                                  setEmail(e.target.value.toLowerCase());
                                  setEmailError(
                                    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                                      e.target.value.toLowerCase()
                                    )
                                  );
                                }}
                              />
                              <div className="clear">
                                <input
                                  type="submit"
                                  value="Register"
                                  name="submit"
                                  className="font-medium text-base bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2 cursor-pointer disabled:bg-gray-500"
                                  disabled={emailError}
                                  onClick={() => {
                                    if (email.length > 0 && !emailError) {
                                      if (
                                        registeredContacts.emails.includes(
                                          email
                                        )
                                      ) {
                                        router.push("/alreadyRegistered");
                                      } else {
                                        addApe();
                                      }
                                    } else {
                                      setEmailError(true);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            {emailError && (
                              <p className="text-red-500 w-10/12 2xl:w-8/12 mx-auto mt-2">
                                Please enter a valid email address
                              </p>
                            )}
                          </>
                        )}
                      </>
                    )}
                    <div
                      className={`w-48 xl:w-64 2xl:w-72 mx-auto border-2 border-gray-800 rounded-lg z-20 py-3 2xl:py-4 ${
                        emailError
                          ? "mt-0 xl:mt-4 2xl:mt-16"
                          : "mt-8 xl:mt-12 2xl:mt-24"
                      }`}
                    >
                      <p className="text-xl xl:text-3xl 2xl:text-4xl font-semibold text-center">
                        {availableSlots}/{MAX_SLOTS} Left
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-center mt-8">
                  Connect with Metamask to claim your Airdrop
                </p>
                <button
                  className="w-48 2xl:w-60 py-4 px-5 mt-5 2xl:mt-16 flex flex-row items-center justify-center rounded-xl mx-auto bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    activate(connectors.Injected);
                  }}
                >
                  <p className="text-lg text-white font-semibold 2xl:text-2xl">
                    Connect Wallet
                  </p>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <img
        src="/images/landingBG.svg"
        className="absolute bottom-0 z-0 w-full bg-white"
      />
    </div>
  );
}
