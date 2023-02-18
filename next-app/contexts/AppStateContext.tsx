import { useToast } from "@chakra-ui/react";
import { capitalize, upperCase } from "lodash";
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
import { GameState, inputToImage } from "../constants/game";
import { Content } from "../constants/menu";
import { getGameManagerContract } from "../contract-helpers/contractInstantiations";
import useCheckGrid from "../hooks/context/useCheckGrid";
import useCheckMBloxBalance from "../hooks/context/useCheckMBloxBalance";
import useCheckMetaBlockBalances from "../hooks/context/useCheckMetaBloxBalances";
import useStore from "../hooks/useStore";
import { Block } from "../constants/blocks";

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
  gameplayMetaBlox: any[];
  setGameplayMetaBlox: Dispatch<SetStateAction<any[]>>;
  handleAddCube: (x: number, y: number, z: number) => void;
  handleRemoveCube: (x: number, y: number, z: number) => void;
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
  const [gameplayMetaBlox, setGameplayMetaBlox] = useState<any[]>([]);
  const [addCube, activeTexture, removeCube, cubes] = useStore((state: any) => [
    state.addCube,
    state.texture,
    state.removeCube,
    state.cubes,
  ]);
  const toast = useToast();

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

  const handleAddCube = (x: number, y: number, z: number) => {
    const blockTypes = Object.values(inputToImage);
    const blockTypesElement = inputToImage[activeTexture];
    const blockIndex = blockTypes.indexOf(blockTypesElement);

    if (gameState === GameState.Building) {
      if (gameplayMetaBlox[blockIndex] > 0) {
        addCube(x, y, z);
        setGameplayMetaBlox((old) => {
          const newBlocks = [...old];
          newBlocks[blockIndex] -= 1;
          return newBlocks;
        });
      } else {
        toast({
          title: "Out of Blocks",
          description: `You currently have no ${capitalize(
            activeTexture
          )} blocks`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      addCube(x, y, z);
    }
  };

  const handleRemoveCube = (x: number, y: number, z: number) => {
    removeCube(x, y, z);

    if (gameState === GameState.Building) {
      const cubeRemovedArray = cubes.filter((cube) => {
        const [X, Y, Z] = cube.pos;
        return X === x && Y === y && Z === z;
      });

      const cubeRemoved = cubeRemovedArray[0];
      const { texture } = cubeRemoved;
      const blockTypes = Object.values(Block);
      const element = upperCase(texture) as Block;
      const blockIndex = blockTypes.indexOf(element);

      setGameplayMetaBlox((old) => {
        const newBlocks = [...old];
        newBlocks[blockIndex] += 1;
        return newBlocks;
      });
    }
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
        gameplayMetaBlox,
        setGameplayMetaBlox,
        handleAddCube,
        handleRemoveCube,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

const useAppContext = () => useContext(AppStateContext);

export { AppStateContextProvider, useAppContext };
