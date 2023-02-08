import { Signer } from "@wagmi/core";
import { getMBloxContract } from "./contractInstantiations";

/**
 * Retrieves the user's current MBlox balance
 * @param signer The signer within the app
 * @param address The address of the player whose balance is being retrieved
 * @returns The MBlox balance of the inputted user
 */
const getMBloxBalance = async (signer: Signer, address: string) => {
  if (!signer) return;
  const contract = getMBloxContract(signer);
  const balance = await contract.balanceOf(address);
  return balance ? Number(balance.toString()) : 0.0;
};

export default getMBloxBalance;
