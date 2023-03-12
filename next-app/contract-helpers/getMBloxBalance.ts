import { ethers } from "ethers";
import { Provider } from "../constants/app";
import { getMBloxContract } from "./contractInstantiations";

/**
 * Retrieves the user's current MBlox balance
 * @param provider The provider within the app
 * @param address The address of the player whose balance is being retrieved
 * @returns The MBlox balance of the inputted user
 */
const getMBloxBalance = async (provider: Provider, address: string) => {
  if (!provider) return;
  const MBloxContract = getMBloxContract(provider);
  const balance = await MBloxContract.balanceOf(address);
  return balance ? Number(ethers.utils.formatUnits(balance, "ether")) : 0.0;
};

export default getMBloxBalance;
