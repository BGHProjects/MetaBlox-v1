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
import { GameState } from "../constants/game";
import { Content } from "../constants/menu";
import { getGameManagerContract } from "../contract-helpers/contractInstantiations";
import useCheckGrid from "../hooks/context/useCheckGrid";
import useCheckMBloxBalance from "../hooks/context/useCheckMBloxBalance";
import useCheckMetaBlockBalances from "../hooks/context/useCheckMetaBloxBalances";

interface IAppStateContext {
  menuContent: Content;
  setMenuContent: Dispatch<SetStateAction<Content>>;
  startingGameplay: boolean;
  setStartingGameplay: Dispatch<SetStateAction<boolean>>;
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState>>;
  mBloxBalance: number;
  setOldMBloxBalance: Dispatch<SetStateAction<string | undefined>>;
  metaBloxBalances: any[];
  setOldMetaBloxBalances: Dispatch<SetStateAction<any[]>>;
  setStartCheckingMetaBlox: Dispatch<SetStateAction<boolean>>;
  playerColour: string;
  usedColours: string[];
  gridData: any[];
  setStartCheckingGridData: Dispatch<SetStateAction<boolean>>;
  setOldGridData: Dispatch<SetStateAction<any[]>>;
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

  const provider = useProvider();
  const { address } = useAccount();

  const { mBloxBalance, setOldMBloxBalance, retrieveBalance } =
    useCheckMBloxBalance();

  const {
    metaBloxBalances,
    setOldMetaBloxBalances,
    retrieveBalances,
    setStartCheckingMetaBlox,
  } = useCheckMetaBlockBalances();

  const {
    gridData,
    retrieveGridData,
    setStartCheckingGridData,
    setOldGridData,
  } = useCheckGrid();

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
    if (address) getPlayerColour(address);
  }, [gridData, address]);

  useEffect(() => {
    if (provider && address) {
      retrieveBalance(provider, address);
      retrieveBalances(provider, address);
      retrieveGridData(provider);
    }
  }, [provider, address]);

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
        setOldMBloxBalance,
        metaBloxBalances,
        setOldMetaBloxBalances,
        setStartCheckingMetaBlox,
        playerColour,
        usedColours,
        gridData,
        setOldGridData,
        setStartCheckingGridData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

const useAppContext = () => useContext(AppStateContext);

export { AppStateContextProvider, useAppContext };
