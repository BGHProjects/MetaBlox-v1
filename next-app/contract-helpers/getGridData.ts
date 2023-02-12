import { Signer } from "ethers";
import { Provider } from "../constants/app";
import { getGameManagerContract } from "./contractInstantiations";

const getGridData = async (signerOrProvider: Signer | Provider) => {
  if (!signerOrProvider) return;
  const GameManager = getGameManagerContract(signerOrProvider);
  const gridData = await GameManager.getGridData();
  return gridData ?? [];
};

export default getGridData;
