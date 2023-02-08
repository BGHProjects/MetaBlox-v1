import { Signer } from "ethers";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { GameState } from "../constants/game";
import { Content } from "../constants/menu";
import getMBloxBalance from "../contract-helpers/getMBloxBalance";
import useStore from "../hooks/useStore";

interface IAppStateContext {
  menuContent: Content;
  setMenuContent: Dispatch<SetStateAction<Content>>;
  startingGameplay: boolean;
  setStartingGameplay: Dispatch<SetStateAction<boolean>>;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  mBloxBalance: number;
  retrieveBalance: (signer: Signer, address: string) => Promise<void>;
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
  const { address } = useAccount();
  const provider = useProvider();

  const [cubes] = useStore((state) => [state.cubes]);
  const [mBloxBalance, setMBloxBalance] = useState(0);

  const retrieveBalance = async (signer: Signer, address: string) => {
    const balance = await getMBloxBalance(signer, address);
    setMBloxBalance(balance ?? 0.0);
  };

  useEffect(() => {
    if (signer && address) {
      retrieveBalance(signer, address);
    }
  }, [signer, address]);

  provider.on("block", () => {
    if (signer && address) {
      retrieveBalance(signer, address);
    }
  });

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
        retrieveBalance,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

const useAppContext = () => useContext(AppStateContext);

export { AppStateContextProvider, useAppContext };
