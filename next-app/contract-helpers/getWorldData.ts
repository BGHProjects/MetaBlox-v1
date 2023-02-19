import { Signer } from "ethers";
import { Provider } from "../constants/app";
import { getWorldContract } from "./contractInstantiations";

/**
 * Gets the on-chain data for a specific World
 * @param id The id of the World to be retrieved
 * @param signerOrProvider The signer or provider for the app
 * @returns The on-chain data for the World of the inputted id
 */
const getWorldData = async (
  id: number,
  signerOrProvider: Signer | Provider
) => {
  const WorldContract = getWorldContract(signerOrProvider);
  const worldData = await WorldContract.worlds(id - 1);
  return worldData ?? undefined;
};

export default getWorldData;
