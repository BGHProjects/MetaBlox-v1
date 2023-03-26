import { Contract, Signer } from "ethers";
import { Provider } from "../constants/app";
import GameManagerJSON from "../contract-jsons/updated/gamemanager.json";
import MBloxJSON from "../contract-jsons/updated/mblox.json";
import MetaBloxJSON from "../contract-jsons/updated/metablox.json";
import WorldJSON from "../contract-jsons/updated/world.json";

/**
 * Instantiates an instance of the MBlox contract
 * @param signerOrProvider Either a signer or provider
 * @returns An instance of the MBlox contract
 */
export const getMBloxContract = (signerOrProvider: Signer | Provider) =>
  new Contract(
    process.env.NEXT_PUBLIC_ACTUAL_MBLOX as string,
    MBloxJSON.abi,
    signerOrProvider
  );

/**
 * Instantiates an instance of the MetaBlox contract
 * @param signerOrProvider Either a signer or provider
 * @returns An instance of the MetaBlox contract
 */
export const getMetaBloxContract = (signerOrProvider: Signer | Provider) =>
  new Contract(
    process.env.NEXT_PUBLIC_ACTUAL_METABLOX as string,
    MetaBloxJSON.abi,
    signerOrProvider
  );

/**
 * Instantiates an instance of the World contract
 * @param signerOrProvider Either a signer or provider
 * @returns An instance of the World contract
 */
export const getWorldContract = (signerOrProvider: Signer | Provider) =>
  new Contract(
    process.env.NEXT_PUBLIC_ACTUAL_WORLD as string,
    WorldJSON.abi,
    signerOrProvider
  );

/**
 * Instantiates an instance of the GameManager contract
 * @param signerOrProvider Either a signer or provider
 * @returns An instance of the GameManager contract
 */
export const getGameManagerContract = (signerOrProvider: Signer | Provider) =>
  new Contract(
    process.env.NEXT_PUBLIC_ACTUAL_GAME_MANAGER as string,
    GameManagerJSON.abi,
    signerOrProvider
  );
