import { Web3Provider } from "@ethersproject/providers";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useWeb3React } from "@web3-react/core";
import { DefaultSingleActionModalProps } from "components/Modal/SingleActionModal";
import Navbar from "components/NavBar";
import BeneficiaryStepBottom from "container/BeneficiaryStepBottom";
import BeneficiaryStepTop from "container/BeneficiaryStepTop";
import EndStep from "container/EndStep";
import MetamaskStep from "container/MetamaskStep";
import { setSingleActionModal } from "context/actions";
import { store } from "context/store";
import { ContractContext } from "context/Web3/contracts";
import router from "next/router";
import { useContext, useEffect, useState } from "react";
import checkApe from "utils/checkApe";

export enum Step {
  Wallet,
  Beneficiary,
  End,
}

export interface RegisteredContacts {
  addresses: string[];
  emails: string[];
}

const MAX_SLOTS = 500;
const MAX_VOTES = 200;

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
  const [availableVotes, setAvailableVotes] = useState<number>(MAX_VOTES);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  useEffect(() => {
    checkAvailableSlots(supabase).then((res) => setAvailableSlots(res));
    getRegisteredContacts(supabase).then((res) => setRegisteredContacts(res));
  }, []);

  useEffect(() => {
    if (error) {
      router.push("/error")
    }
  }, [error]);

  useEffect(() => {
    /*if (!account || !contracts) {
      return;
    }
    if (registeredContacts.addresses.includes(account)) {
      router.push("/alreadyRegistered");
    } else {
      checkApe(contracts.bayc, account).then(
        (hasApe) => !hasApe && router.push("/noApe")
      );
      setEthAddress(account);
    }*/
  }, [account]);

  async function addApe(
    account: string,
    email: string,
    votes: number[]
  ): Promise<void> {
    const message = await library
      .getSigner()
      .signMessage("By signing this message, I verify I own this address");
    if (message) {
      try {
        await supabase.from("Apes").insert([
          {
            address: account ? account : ethAddress,
            email: email,
            beneficiary0: votes[0],
            beneficiary1: votes[1],
            beneficiary2: votes[2],
            beneficiary3: votes[3],
            beneficiary4: votes[4],
          },
        ]);
        setStep(Step.End);
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
    <>
      <div
        className={`base:block w-full h-screen bg-white overflow-x-hidden`}
      >
        <div
          className="relative z-20 overflow-visible h-full min-h-screen w-screen bg-center bg-cover bg-no-repeat bg-hero-pattern"
          style={{ height: "121%" }}
        >
          <div className="pt-10 2xl:pt-12">
            <Navbar />
            <div className="flex flex-col w-full mt-12 xl:mt-24">
              <img
                src="/images/hero.png"
                alt="hero"
                className="w-1/3 mx-auto" 
              />
              <div className="flex flex-col">
                <p className="w-2/3 xl:w-1/3 md:w-1/3 text-sm xl:text-xl mt-12 2xl:mt-16 mx-auto text-gray-900 font-light text-center">
                  This airdrop sends 100 $POP to your wallet and {MAX_VOTES}{" "}
                  $POP to the charities you select. Simply verify BAYC
                  ownership, pick your charity allocations, and await your
                  airdrop. In the meantime, join us in{" "}
                  <a
                    className="font-normal cursor-pointer"
                    href="https://discord.gg/RN4VGqPDwX"
                    target="_blank">
                    {" "} Discord
                  </a>{" "} and follow us on{" "}
                  <a
                    className="font-normal cursor-pointer"
                    href="https://twitter.com/popcorn_DAO"
                    target="_blank">
                    Twitter
                  </a>
                </p>
            </div>

            <MetamaskStep
              isActive={step === Step.Wallet}
              setStep={setStep}
              availableSlots={availableSlots}
              maxSlots={MAX_SLOTS}
              activate={activate}/>
            <EndStep isActive={step === Step.End} />
            <BeneficiaryStepTop
              isActive={step === Step.Beneficiary}
              maxVotes={MAX_VOTES}
              availableVotes={availableVotes}/>
          </div>
        </div>
        {chainId === 1 && (
          <BeneficiaryStepBottom
            isActive={step === Step.Beneficiary}
            maxVotes={MAX_VOTES}
            availableVotes={availableVotes}
            setAvailableVotes={setAvailableVotes}
            account={account}
            registeredContacts={registeredContacts}
            submitVotes={addApe}
          />
        )}
      </div>
      <div
        className={`hidden w-full h-screen bg-white overflow-x-hidden`}
      >
        <div
          className="relative h-full min-h-screen w-screen bg-center bg-contain bg-no-repeat bg-hero-pattern"
          style={{ height: "111%" }}
        >
          <div className="">
            <Navbar />
            <div className="flex flex-col w-full">
              <div className="h-full bg-primary pt-12">
                <img
                  src="/images/hero.png"
                  alt="hero"
                  className="w-1/3 mx-auto"
                />
              </div>
              <div className="flex flex-col">
                <p className="text-lg xl:text-xl 2xl:text-3xl base:w-6/12 lg:w-1/3 pt-12 mx-auto text-gray-900 font-light text-center bg-primary">
                  This airdrop sends 100 $POP to your wallet and {MAX_VOTES}{" "}
                  $POP to the charities you select. Simply verify BAYC
                  ownership, pick your charity allocations, and await your
                  airdrop. In the meantime, join us in{" "}
                  <a
                    className="font-normal cursor-pointer"
                    href="https://discord.gg/RN4VGqPDwX"
                    target="_blank">
                    Discord
                  </a>{" "}
                  and follow us on{" "}
                  <a
                    className="font-normal cursor-pointer"
                    href="https://twitter.com/popcorn_DAO"
                    target="_blank">
                    Twitter
                  </a>
                </p>
                <MetamaskStep
                  isActive={step === Step.Wallet}
                  setStep={setStep}
                  availableSlots={availableSlots}
                  maxSlots={MAX_SLOTS}
                  activate={activate}
                />
                <EndStep isActive={step === Step.End} />
                <BeneficiaryStepTop
                  isActive={step === Step.Beneficiary}
                  maxVotes={MAX_VOTES}
                  availableVotes={availableVotes}
                />
              </div>
            </div>
          </div>
        </div>
        {chainId === 1 && (
          <BeneficiaryStepBottom
            isActive={step === Step.Beneficiary}
            maxVotes={MAX_VOTES}
            availableVotes={availableVotes}
            setAvailableVotes={setAvailableVotes}
            account={account}
            registeredContacts={registeredContacts}
            submitVotes={addApe}
          />
        )}
        </div>
      </div>
    </>
  );
}
