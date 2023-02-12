import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useProvider } from "wagmi";
import { Provider } from "../constants/app";
import { GameState } from "../constants/game";
import { Content } from "../constants/menu";
import { getGameManagerContract } from "../contract-helpers/contractInstantiations";
import useCheckMBloxBalance from "../hooks/context/useCheckMBloxBalance";
import useCheckMetaBlockBalances from "../hooks/context/useCheckMetaBloxBalances";
import useStore from "../hooks/useStore";

interface IAppStateContext {
  menuContent: Content;
  setMenuContent: Dispatch<SetStateAction<Content>>;
  startingGameplay: boolean;
  setStartingGameplay: Dispatch<SetStateAction<boolean>>;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  mBloxBalance: number;
  setExpectedMBloxBalance: Dispatch<SetStateAction<number>>;
  metaBloxBalances: any[];
  playerColour: string;
  usedColours: string[];
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
  const [playerColour, setPlayerColour] = useState("");
  const [usedColours, setUsedColours] = useState([]);

  const [cubes] = useStore((state: any) => [state.cubes]);
  const { mBloxBalance, setExpectedMBloxBalance } = useCheckMBloxBalance();
  const { metaBloxBalances } = useCheckMetaBlockBalances();

  const provider = useProvider();
  const { address } = useAccount();

  const getPlayerColour = async (provider: Provider, address: string) => {
    const GameManager = getGameManagerContract(provider);
    const colour = await GameManager.getPlayerColour(address);
    setPlayerColour(colour);
  };

  const getUsedColours = async (provider: Provider) => {
    const GameManager = getGameManagerContract(provider);
    const usedColours = await GameManager.getUsedColours();
    setUsedColours(usedColours ?? []);
  };

  useEffect(() => {
    if (address && provider) {
      getPlayerColour(provider, address);
      getUsedColours(provider);
    }
  }, [provider, address]);

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

  return (
    <AppStateContext.Provider
      value={{
        menuContent,
        setMenuContent,
        startingGameplay,
        setStartingGameplay,
        gameState,
        setGameState,
        mBloxBalance,
        setExpectedMBloxBalance,
        metaBloxBalances,
        playerColour,
        usedColours,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

const useAppContext = () => useContext(AppStateContext);

export { AppStateContextProvider, useAppContext };
