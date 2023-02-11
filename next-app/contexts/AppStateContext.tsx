import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { GameState } from "../constants/game";
import { Content } from "../constants/menu";
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

  const [cubes] = useStore((state: any) => [state.cubes]);
  const { mBloxBalance, setExpectedMBloxBalance } = useCheckMBloxBalance();
  const { metaBloxBalances } = useCheckMetaBlockBalances();

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
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

const useAppContext = () => useContext(AppStateContext);

export { AppStateContextProvider, useAppContext };
