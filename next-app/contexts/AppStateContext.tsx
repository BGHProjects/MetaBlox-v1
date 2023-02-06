import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useSigner } from "wagmi";
import { GameState } from "../constants/game";
import { Content } from "../constants/menu";
import {
  getGameManagerContract,
  getMBloxContract,
  getMetaBloxContract,
  getWorldContract,
} from "../contract-helpers/contractInstantiations";
import useStore from "../hooks/useStore";

interface IAppStateContext {
  menuContent: Content;
  setMenuContent: Dispatch<SetStateAction<Content>>;
  startingGameplay: boolean;
  setStartingGameplay: Dispatch<SetStateAction<boolean>>;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
}

const AppStateContext = createContext<IAppStateContext>({} as IAppStateContext);

const AppStateContextProvider = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [menuContent, setMenuContent] = useState<Content>(Content.None);
  const [startingGameplay, setStartingGameplay] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.None);

  const { data: signer } = useSigner();
  const { address, isDisconnected } = useAccount();

  const [cubes] = useStore((state) => [state.cubes]);

  /**
   * Just used for testing
   * Will be worked on later
   *
   * Should probably strip the key before saving on-chain
   * Because its probably going to be massive
   */
  useEffect(() => {
    if (cubes.length > 0) {
      console.log("\n\tCubes: ", cubes);

      const strings = cubes.map((cube) => JSON.stringify(cube));
      console.log("\n\tStrings: ", strings);

      const string = strings.toString();
      console.log("\n\t String: ", string);

      const backToArray = string.split("},");
      console.log(backToArray);

      backToArray.forEach((item, index, array) => {
        if (array[index][array[index].length - 1] !== "}") array[index] += "}";
      });

      console.log("Correct array: ", backToArray);

      backToArray.forEach((item) => {
        console.log(JSON.parse(item));
      });
    }
  }, [cubes]);

  useEffect(() => {
    if (signer) {
      console.log("signer", signer);
      const MBlox = getMBloxContract(signer);
      console.log("MBlox contract: ", MBlox);

      const MetaBlox = getMetaBloxContract(signer);
      console.log("MetaBlox contract ", MetaBlox);

      const World = getWorldContract(signer);
      console.log("World contract ", World);

      const GameManager = getGameManagerContract(signer);
      console.log("Gamemanager contract ", GameManager);
    }
  }, [signer]);

  useEffect(() => {
    if (!address || isDisconnected) {
      console.log("There is no wallet connected");
    }
  }, [address, isDisconnected]);

  useEffect(() => {
    console.log("GameState ", gameState);
  }, [gameState]);

  return (
    <AppStateContext.Provider
      value={{
        menuContent,
        setMenuContent,
        startingGameplay,
        setStartingGameplay,
        gameState,
        setGameState,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

const useAppContext = () => useContext(AppStateContext);

export { AppStateContextProvider, useAppContext };
