import { parseEther } from "@ethersproject/units";
import { utils } from "ethers";
import { loadTree } from "./merkleTree";

export default function generateProof(airdrop: any, account: string): any {
  const tree = loadTree(airdrop);
  const leaf = utils.solidityKeccak256(
    ["address", "uint256"],
    [account, parseEther(airdrop[account])]
  );
  return tree.getHexProof(leaf);
}
