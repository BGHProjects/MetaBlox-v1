import { BigNumberish, ethers, Signer } from "ethers";
import { getMetaBloxContract } from "./contractInstantiations";

/**
 * Retrieves the user's current balances for every type of MetaBlox block
 * @param signer The signer within the app
 * @param address The address of the player whose balance is being returned
 * @returns The balances of every MetaBlox block for an inputted user
 */
const getAllMetaBloxBalances = async (signer: Signer, address: string) => {
  if (!signer) return;
  const contract = getMetaBloxContract(signer);
  const addresses = Array(10).fill(address);
  const allIds = Array.from(Array(10).keys());
  const balances = await contract.balanceOfBatch(addresses, allIds);

  const formatted = balances.map((item: BigNumberish) =>
    Math.round(Number(ethers.utils.formatUnits(item, "wei")))
  );
  return formatted ?? Array(10).fill(0);
};

export default getAllMetaBloxBalances;
