import { isEqual } from "lodash";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
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
import getAllMetaBloxBalances from "../contract-helpers/getAllMetaBloxBalances";
import getMBloxBalance from "../contract-helpers/getMBloxBalance";
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
  setOldMBloxBalance: Dispatch<SetStateAction<number>>;
  metaBloxBalances: any[];
  setOldMetaBloxBalances: Dispatch<SetStateAction<any[]>>;
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

  const [mBloxBalance, setMBloxBalance] = useState(0);
  const [oldMBloxBalance, setOldMBloxBalance] = useState(0);
  const [checkingMBlox, setCheckingMBlox] = useState(false);

  const [metaBloxBalances, setMetaBloxBalances] = useState(Array(10).fill(0));
  const [oldMetaBloxBalances, setOldMetaBloxBalances] = useState(
    Array(10).fill(0)
  );
  const [checkingMetaBlox, setCheckingMetaBlox] = useState(false);

  const provider = useProvider();
  const { address } = useAccount();

  /**
   * ===========================
   *  MBLOX
   * ===========================
   */

  let mbloxInterval: any = null;

  const retrieveBalance = useCallback(
    async (provider: Provider, address: string) => {
      const balance = await getMBloxBalance(provider, address);
      console.log("Balance ", balance);
      setMBloxBalance(balance ?? 0.0);
    },
    [provider, address]
  );

  useEffect(() => {
    if (mBloxBalance !== oldMBloxBalance && checkingMBlox) {
      clearInterval(mbloxInterval);
      setOldMBloxBalance(0);
      setCheckingMBlox(false);
    }
  }, [mBloxBalance, oldMBloxBalance]);

  useEffect(() => {
    if (provider && address && oldMBloxBalance) {
      if (!checkingMBlox) {
        setCheckingMBlox(true);
        mbloxInterval = setInterval(() => {
          retrieveBalance(provider, address);
        }, 1000);
      }
    }
    return () => {
      clearInterval(mbloxInterval);
    };
  }, [provider, address, oldMBloxBalance, mBloxBalance]);

  /**
   * ===========================
   *  METABLOX
   * ===========================
   */

  let metabloxInterval: any = null;

  const retrieveBalances = useCallback(
    async (provider: Provider, address: string) => {
      const balances = await getAllMetaBloxBalances(provider, address);
      console.log("Balances ", balances);
      setMetaBloxBalances(balances as Array<number>);
    },
    [provider, address]
  );

  useEffect(() => {
    if (
      checkingMetaBlox &&
      !isEqual(oldMetaBloxBalances, Array(10).fill(0)) &&
      !isEqual(metaBloxBalances, oldMetaBloxBalances)
    ) {
      console.log("\n\t ==== Cleared ======");
      clearInterval(metabloxInterval);
      setOldMetaBloxBalances(Array(10).fill(0));
      setCheckingMetaBlox(false);
    }
  }, [metaBloxBalances, oldMetaBloxBalances]);

  useEffect(() => {
    if (
      provider &&
      address &&
      !isEqual(oldMetaBloxBalances, Array(10).fill(0))
    ) {
      if (!checkingMetaBlox) {
        console.log("\n\t ===== Firing this one off =====");
        setCheckingMetaBlox(true);
        metabloxInterval = setInterval(() => {
          retrieveBalances(provider, address);
        }, 1000);
      }
    }
    return () => {
      clearInterval(metabloxInterval);
    };
  }, [provider, address, oldMetaBloxBalances, metaBloxBalances]);

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
    if (provider && address) {
      retrieveBalance(provider, address);
      retrieveBalances(provider, address);
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
