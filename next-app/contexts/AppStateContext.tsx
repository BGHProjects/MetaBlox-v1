import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
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

  const [mBloxBalance, setExpectedMBloxBalance] = useState(0);
  const metaBloxBalances = [];

  // const { mBloxBalance, setExpectedMBloxBalance } = useCheckMBloxBalance();
  // const { metaBloxBalances } = useCheckMetaBlockBalances();

  const provider = useProvider();
  const { address } = useAccount();

  const GameManager = useMemo(() => {
    return getGameManagerContract(provider);
  }, [provider]);

  const getPlayerColour = async (address: string) => {
    const colour = await GameManager.getPlayerColour(address);
    setPlayerColour(colour);
  };

  const getUsedColours = async () => {
    const usedColours = await GameManager.getUsedColours();
    setUsedColours(usedColours ?? []);
  };

  useEffect(() => {
    if (address && GameManager) {
      getPlayerColour(address);
      getUsedColours();
    }
  }, [GameManager, address]);

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
