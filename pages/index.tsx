import { BigNumber } from "@ethersproject/bignumber";
import { Web3Provider } from "@ethersproject/providers";
import { createClient } from "@supabase/supabase-js";
import { useWeb3React } from "@web3-react/core";
import BeneficiaryCard from "components/BeneficiaryCard";
import { DefaultSingleActionModalProps } from "components/Modal/SingleActionModal";
import Navbar from "components/NavBar";
import { setSingleActionModal } from "context/actions";
import { store } from "context/store";
import { connectors } from "context/Web3/connectors";
import { ContractContext } from "context/Web3/contracts";
import { Contract } from "ethers";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import beneficiaries from "../public/beneficiaries.json";

async function checkApe(contract: Contract, account: string): Promise<boolean> {
  const apeBalance = await contract.balanceOf(account);
  return apeBalance.gt(BigNumber.from("0"));
}

const MAX_VOTES = 300;

const IndexPage = () => {
  const router = useRouter();
  const context = useWeb3React<Web3Provider>();
  const { contract } = useContext(ContractContext);
  const { library, account, activate, active } = context;
  const { dispatch } = useContext(store);
  const [hasApe, setHasApe] = useState<boolean>(false);
  const [availableVotes, setAvailableVotes] = useState<number>(MAX_VOTES);
  const [votes, setVotes] = useState<number[]>([0, 0, 0, 0, 0]);
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
    checkApe(contract, account).then((res) => {
      setHasApe(res);
      dispatch(
        setSingleActionModal({
          content: `You can only participate if you have a Bored Ape...`,
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
      <div className="w-9/12 mx-auto mt-12 h-full">
        <h2 className="text-2xl font-semibold">
          Distribute POP to Beneficiaries
        </h2>
        <p className="text-lg">{availableVotes} POP left</p>
        <div className="flex flex-wrap items-center">
          {beneficiaries.map((beneficiary, i) => (
            <BeneficiaryCard
              beneficiary={beneficiary}
              setVotes={updateVotes}
              maxVotes={MAX_VOTES}
              assignedVotes={votes[i]}
              index={i}
            />
          ))}
        </div>
        <div className="mt-24 pb-48">
        <button
          onClick={() => account ? addApe(account, votes) : activate(connectors.Injected)}
          disabled={account ? !hasApe : false}
          className="button button-primary mx-auto w-80"
        >
          {account ? "Submit" : "Connect Wallet"}
        </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
