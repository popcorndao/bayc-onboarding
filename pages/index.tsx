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
import {BrowserView, MobileView} from 'react-device-detect';
import AutoScale from 'react-auto-scale';

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
    if (!account || !contracts) {
      return;
    }
    if (registeredContacts.addresses.includes(account)) {
      router.push("/alreadyRegistered");
    } else {
      // checkApe(contracts.bayc, account).then(
      //   (hasApe) => !hasApe && router.push("/noApe")
      // );
      setEthAddress(account);
    }
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
      <BrowserView>
        <div className={"home"}>
          <AutoScale>
            <div className={"home-container"}>
              <Navbar />
              <div className={"home-content"}>
                <img
                  src="/images/hero.png"
                  alt="hero"
                  className={"hero-image"}/>

                <p className="text-lg xl:text-xl 2xl:text-3xl mt-12 2xl:mt-16 w-1/3 mx-auto text-gray-900 font-light text-center">
                  This airdrop sends 100 $POP to your wallet and {MAX_VOTES}
                  $POP to the charities you select. Your airdropped tokens are
                  locked until $POP staking in 2022. Simply verify BAYC
                  ownership, pick your charity allocations, and await your
                  airdrop. In meantime, join us on  
                  <a
                    className="font-normal cursor-pointer"
                    href="https://discord.gg/RN4VGqPDwX"
                    target="_blank">
                    {" "} Discord
                  </a>{" "}
                  and follow us on{" "}
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
        </AutoScale>
      </div>
      <BeneficiaryStepBottom
          isActive={step === Step.Beneficiary}
          maxVotes={MAX_VOTES}
          availableVotes={availableVotes}
          setAvailableVotes={setAvailableVotes}
          account={account}
          registeredContacts={registeredContacts}
          submitVotes={addApe}/>
      </BrowserView>

      <MobileView>
      <div className={"mobile-container"}>
      <div className={"mobile-background-image"}>
        <div className={"mobile-content"}>
          <Navbar />
          <div>
            <h1 className="text-2xl font-medium w-10/12 text-center mx-auto">
              This site is not available on mobile.
            </h1>
          </div>
          <div>
            <p className="mt-4 text-xl font-light z-20">
                  Follow our
                  <a
                    className="font-normal text-xl cursor-pointer z-20 mt-8 mx-2"
                    href="https://discord.gg/RN4VGqPDwX"
                    target="_blank">
                    Discord
                  </a>{" "}
                  and
                  <a
                    className="font-normal text-xl cursor-pointer z-20 mt-8 mx-2"
                    href="https://twitter.com/popcorn_DAO"
                    target="_blank">
                    Twitter
                  </a>{" "}
                  for the next drop!
            </p>
          </div>
        </div>
      </div>
      </div>
      </MobileView>
    </>
  );
}
