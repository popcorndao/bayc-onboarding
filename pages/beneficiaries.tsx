import { Web3Provider } from "@ethersproject/providers";
import { createClient } from "@supabase/supabase-js";
import { useWeb3React } from "@web3-react/core";
import Beneficiary from "components/Beneficiary";
import { DefaultSingleActionModalProps } from "components/Modal/SingleActionModal";
import Navbar from "components/NavBar";
import { setSingleActionModal } from "context/actions";
import { store } from "context/store";
import { connectors } from "context/Web3/connectors";
import { ContractContext } from "context/Web3/contracts";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import checkApe from "utils/checkApe";
import beneficiaries from "../public/beneficiaries.json";

const MAX_VOTES = 300;

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
  const { contract } = useContext(ContractContext);
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
    if (!account || !contract) {
      return;
    }
    checkApe(contract, account).then((hasApe) => {
      hasApe ? setHasApe(true) : router.push("/error");
    });
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

  async function addApe(address: string, votes: number[]) {
    const message = library
      .getSigner()
      .signMessage("By signing this message, I verify I own this address");
    if (message) {
      try {
        await supabase.from("Apes").insert([
          {
            address: address,
            beneficiary0: votes[0],
            beneficiary1: votes[1],
            beneficiary2: votes[2],
            beneficiary3: votes[3],
            beneficiary4: votes[4],
          },
        ]);
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
  }

  return (
    <div className="w-full h-screen bg-white">
      <Navbar />
      <img
        src="/images/heroBG.svg"
        alt="heroBG"
        className="absolute top-0 z-0"
      />
      <div className="z-10 relative flex justify-center">
        <div className="flex flex-col mt-16">
          <button
            className="w-56 py-4 px-5 mt-8 flex flex-row items-center justify-center rounded-xl mx-auto bg-blue-100 border-2 border-blue-600 hover:bg-blue-400"
            onClick={() =>
              account ? deactivate() : activate(connectors.Injected)
            }
          >
            <p className="text-xl text-blue-600 font-semibold">
              {account ? "Disconnect Wallet" : "Connect Wallet"}
            </p>
          </button>
          <p className="mt-8 text-xl text-center">Available Rewards</p>
          <div className="bg-white border border-gray-900 rounded-md mt-2 px-20 py-4">
            <h1 className="text-5xl text-center font-medium">
              {availableVotes} POP
            </h1>
          </div>
        </div>
      </div>
      <div className="w-9/12 mx-auto mt-28 h-full relative">
        <h2 className="text-4xl font-medium text-center pt-4">
          Select your charity allocations
        </h2>
        <div className="w-9/12 mt-12 z-10 mx-auto">
          <Beneficiary
            beneficiary={beneficiaries[beneficiaryIndex]}
            setVotes={updateVotes}
            maxVotes={MAX_VOTES}
            assignedVotes={votes[beneficiaryIndex]}
            beneficiaryIndex={beneficiaryIndex}
            setBeneficiaryIndex={setBeneficiaryIndex}
          />
          <div className="mt-36 pl-4 ml-80 pb-24 relative z-20">
            <button
              className="w-56 py-4 px-5flex flex-row rounded-xl mx-auto bg-blue-600 hover:bg-blue-700 disabled:opacity-75"
              onClick={() => addApe(account, votes)}
              disabled={hasApe || availableVotes > 0 || !account}
            >
              <p className="text-xl text-white font-semibold">Submit</p>
            </button>
          </div>
        </div>
        <img src="/images/beneficiaryBG.svg" className="absolute top-20 left-10 z-0 w-11/12" />
      </div>
    </div>
  );
};

export default IndexPage;
