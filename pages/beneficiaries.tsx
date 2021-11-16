import { Web3Provider } from "@ethersproject/providers";
import { parseEther } from "@ethersproject/units";
import { createClient } from "@supabase/supabase-js";
import { useWeb3React } from "@web3-react/core";
import Beneficiary from "components/Beneficiary";
import Navbar from "components/NavBar";
import { store } from "context/store";
import { connectors, networkMap } from "context/Web3/connectors";
import { ContractContext } from "context/Web3/contracts";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import checkEligibilityAndRoute from "utils/checkEligibilityAndRoute";
import generateProof from "utils/generateProof";
import getRequiredAddresses from "utils/getRequiredAddresses";
import airdrop from "../public/airdrop.json";
import beneficiaries from "../public/beneficiaries.json";

enum Phase {
  SignUp,
  Claim,
}

const MAX_VOTES = 200;
const PHASE = Phase.SignUp;

const IndexPage = () => {
  const router = useRouter();
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
  const [hasApe, setHasApe] = useState<boolean>(false);
  const [availableVotes, setAvailableVotes] = useState<number>(MAX_VOTES);
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0, 0]);
  const [beneficiaryIndex, setBeneficiaryIndex] = useState<number>(0);
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      router.replace(window.location.pathname);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!account || !contracts) {
      return;
    }
    if (PHASE === Phase.SignUp) {
      router.push("/error");
    } else {
      checkEligibilityAndRoute(
        contracts.merkleOrchard,
        router,
        airdrop,
        account
      );
    }
  }, [account]);

  function updateVotes(vote: number, i: number): void {
    const newVotes = votes;
    newVotes[i] = 0;
    const oldTotal = newVotes.reduce(function (acc, val) {
      return acc + val;
    }, 0);
    if (oldTotal + vote > MAX_VOTES) {
      setAvailableVotes((prevState) => 0);
      const remaining = MAX_VOTES - oldTotal;
      newVotes[i] = remaining;
      setVotes((prevState) => newVotes);
    } else {
      newVotes[i] = vote;
      setAvailableVotes((prevState) => MAX_VOTES - (oldTotal + vote));
      setVotes((prevState) => newVotes);
    }
  }

  async function addVotes(address: string, votes: number[]): Promise<boolean> {
    try {
      await supabase.from("BeneficiaryVotes").insert([
        {
          beneficiary0: votes[0],
          beneficiary1: votes[1],
          beneficiary2: votes[2],
          beneficiary3: votes[3],
          beneficiary4: votes[4],
          ape: account,
        },
      ]);
      return true;
    } catch (error) {
      console.log("error", error);
      return false;
    }
  }

  async function claimAirdrop(): Promise<void> {
    toast.loading("Claiming airdrop...");
    const requiredAddresses = getRequiredAddresses(
      networkMap[process.env.CHAIN_ID]
    );
    const proof = generateProof(airdrop, account);
    await contracts.merkleOrchard
      .connect(library.getSigner())
      .claimDistributions(
        account,
        [
          {
            distributionId: 0,
            balance: parseEther(airdrop[account]),
            distributor: requiredAddresses.distributor,
            tokenIndex: 0,
            merkleProof: proof,
          },
        ],
        [requiredAddresses.pop]
      )
      .then((res) =>
        res.wait().then((res) => {
          toast.dismiss();
          toast.success("Claimed Airdrop!");
        })
      )
      .catch((err) => {
        if (
          err.message ===
          "MetaMask Tx Signature: User denied transaction signature."
        ) {
          toast.error("Transaction was canceled");
        } else {
          toast.error(err.message.split("'")[1]);
        }
      });
  }

  return (
    <div className="w-full h-screen bg-white">
      <Toaster position="top-right" />
      <Navbar />
      <img
        src="/images/heroBG.svg"
        alt="heroBG"
        className="absolute top-0 z-0 w-full"
      />
      <div className="z-10 relative flex justify-center xl:mt-8 2xl:mt-16">
        <div className="flex flex-col lg:mt-8 xl:mt-16">
          <button
            className="w-56 py-2 xl:py-4 px-5 mt-8 lg:mt-0 flex flex-row items-center justify-center rounded-xl mx-auto bg-blue-100 border-2 border-blue-600 hover:bg-blue-400"
            onClick={() =>
              account ? deactivate() : activate(connectors.Injected)
            }
          >
            <p className="text-xl text-blue-600 font-semibold">
              {account ? "Disconnect Wallet" : "Connect Wallet"}
            </p>
          </button>
          <p className="text-xl 2xl:text-3xl text-center mt-8 2xl:mt-20">
            Available Rewards
          </p>
          <div className="bg-white border border-gray-900 rounded-xl mt-2 px-20 py-4">
            <h1 className="text-5xl text-center font-medium">
              {availableVotes} POP
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full xl:w-9/12 mx-auto mt-20 h-full relative">
        <h2 className="w-1/2 mx-auto text-4xl font-medium text-center pt-4">
          Congratulations!
        </h2>
        <h2 className="w-1/2 mx-auto text-2xl text-center pt-2">
          You can now allocate {MAX_VOTES} tokens between these organizations to
          claim your POP.
        </h2>
        <div className="w-9/12 mt-14 z-10 mx-auto">
          <Beneficiary
            beneficiary={beneficiaries[beneficiaryIndex]}
            setVotes={updateVotes}
            maxVotes={MAX_VOTES}
            assignedVotes={votes[beneficiaryIndex]}
            beneficiaryIndex={beneficiaryIndex}
            setBeneficiaryIndex={setBeneficiaryIndex}
          />
          <div className="mt-24 2xl:mt-40 pl-4 ml-80 pb-24 relative z-20">
            <button
              className="w-56 py-4 rounded-xl mx-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              onClick={() => {
                addVotes(account, votes).then((res) => {
                  res ? claimAirdrop() : router.push("/error");
                });
              }}
              disabled={!hasApe || availableVotes > 0 || !account}
            >
              <p className="text-xl text-white font-semibold">Submit</p>
            </button>
          </div>
        </div>
        <img
          src="/images/beneficiaryBG.svg"
          className="absolute top-28 left-10 z-0 w-11/12 2xl:w-8/12 2xl:left-28"
        />
      </div>
    </div>
  );
};

export default IndexPage;
