import MBloxJSON from "../contract-jsons/mblox.json";
import MetaBloxJSON from "../contract-jsons/metablox.json";
import WorldJSON from "../contract-jsons/world.json";
import GameManagerJSON from "../contract-jsons/gamemanager.json";
import { Contract, providers, Signer } from "ethers";

type Provider = providers.Provider;

/**
 * Instantiates an instance of the MBlox contract
 * @param signerOrProvider Either a signer or provider
 * @returns An instance of the MBlox contract
 */
export const getMBloxContract = (signerOrProvider: Signer | Provider) =>
  new Contract(
    process.env.NEXT_PUBLIC_TEST_MBLOX as string,
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
    process.env.NEXT_PUBLIC_TEST_METABLOX as string,
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
    process.env.NEXT_PUBLIC_TEST_WORLD as string,
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
    process.env.NEXT_PUBLIC_TEST_GAMEMANAGER as string,
    GameManagerJSON.abi,
    signerOrProvider
  );
