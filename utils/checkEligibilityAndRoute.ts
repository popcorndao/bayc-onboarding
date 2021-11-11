import { parseEther } from "@ethersproject/units";
import { networkMap } from "context/Web3/connectors";
import generateProof from "./generateProof";
import getRequiredAddresses from "./getRequiredAddresses";

async function checkEligibilityAndRoute(
  contract,
  router,
  airdrop,
  account
): Promise<void> {
  const requiredAddresses = getRequiredAddresses(networkMap[process.env.CHAIN_ID]);
  const proof = generateProof(airdrop, account);
  const isValidClaim = await contract.verifyClaim(
    requiredAddresses.pop,
    requiredAddresses.distributor,
    0,
    account,
    parseEther(airdrop[account]),
    proof
  );

  const isClaimed = await contract.isClaimed(
    requiredAddresses.pop,
    requiredAddresses.distributor,
    0,
    account
  );

  if (isValidClaim && !isClaimed) {
    router.push("/claim");
  } else {
    router.push("/error");
  }
}

export default checkEligibilityAndRoute;
