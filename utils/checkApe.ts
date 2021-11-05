import { Contract } from "ethers";
import {BigNumber} from "@ethersproject/bignumber";

async function checkApe(contract: Contract, account: string): Promise<boolean> {
  const apeBalance = await contract.balanceOf(account);
  return apeBalance.gt(BigNumber.from("0"));
}

export default checkApe;
