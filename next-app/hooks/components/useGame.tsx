import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { GameState } from "../../constants/game";
import { useAppContext } from "../../contexts/AppStateContext";
import { getGameManagerContract } from "../../contract-helpers/contractInstantiations";
import useKeyboard from "../useKeyboard";
import useStore from "../useStore";

const useGame = (animDuration: number) => {
  const [showingSomething, setShowingSomething] = useState(false);
  const [display, setDisplay] = useState("flex");
  const [exiting, setExiting] = useState(false);
  const [worldPopulated, setWorldPopulated] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const {
    setStartingGameplay,
    setGameState,
    gameState,
    setGameplayMetaBlox,
    worldData,
    convertOnChainCubesToGame,
    convertGameCubesToOnChain,
    gameplayMetaBlox,
    metaBloxBalances,
    setOldMetaBloxBalances,
    setStartCheckingMetaBlox,
  } = useAppContext();
  const { quit } = useKeyboard();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [setCubes, resetWorld] = useStore((state: any) => [
    state.setCubes,
    state.resetWorld,
  ]);

  const populateWorld = () => {
    const worldLayout = worldData.worldBlockDetails.worldLayout;
    if (worldLayout === "[]") {
      setWorldPopulated(true);
      return;
    }
    const onChainCubes = convertOnChainCubesToGame(worldLayout);
    setCubes(onChainCubes);
    setWorldPopulated(true);
  };

  useEffect(() => {
    if (gameState === GameState.Building || gameState === GameState.Visiting)
      populateWorld();
  }, []);

  useEffect(() => {
    console.log("display", display);
  }, [display]);

  useEffect(() => {
    if (worldPopulated || gameState === GameState.Sandbox) {
      setStartingGameplay(false);
      setWorldPopulated(false);
    }
  }, [worldPopulated, gameState]);

  const quitFunction = () => {
    setDisplay("flex");
    setGameplayMetaBlox([]);
    resetWorld();
    setExiting(true);
    setGameState(GameState.None);
    setTimeout(() => {
      router.push("/");
    }, (animDuration + 1) * 1000);
  };

  const quitWithSave = async () => {
    try {
      await saveWorldChanges();
      quitFunction();
    } catch (err) {
      console.log("err in quitWithSave ", err);
    }
  };

  const saveWorldChanges = async () => {
    const increaseIds: number[] = [];
    const increases: number[] = [];
    const decreaseIds: number[] = [];
    const decreases: number[] = [];
    let blockTotal = Number(worldData.worldBlockDetails.blockTotal);

    gameplayMetaBlox.forEach((value, index) => {
      const onChainValue = metaBloxBalances[index];

      if (onChainValue === value) return;

      const difference = onChainValue - value;

      // The player has used some of their blocks in-game
      if (difference > 0) {
        decreaseIds.push(index);
        decreases.push(difference);
        blockTotal += difference;
      }

      // The player has retrieved some of their blocks in-game
      if (difference < 0) {
        increaseIds.push(index);
        increases.push(Math.abs(difference));
        blockTotal += difference;
      }
    });

    const worldLayout = convertGameCubesToOnChain();

    if (!signer) {
      toast({
        title: "Issue with Signer",
        description:
          "There was an issue with the signer, and this transaction could not be completed. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const gameManager = getGameManagerContract(signer);

      const eu = ethers.utils;

      const dateTime = new Date().toString();

      const gameWallet = ethers.Wallet.fromMnemonic(
        process.env.NEXT_PUBLIC_GAME_WALLET_MNEMONIC as string
      );

      const data = eu.defaultAbiCoder.encode(
        [
          "address",
          "uint256",
          "tuple(uint256 blockTotal, string worldLayout) worldBlockDetails",
          "tuple(uint256[] increaseIds, uint256[] increases, uint256[] decreaseIds, uint256[] decreases) blockUpdates",
          "string",
        ],
        [
          address,
          Number(ethers.utils.formatUnits(worldData.id, "wei")),
          { blockTotal, worldLayout },
          { increaseIds, increases, decreaseIds, decreases },
          dateTime,
        ]
      );

      const hash = eu.keccak256(data);

      const sig = await gameWallet.signMessage(eu.arrayify(hash));

      const tx = await gameManager.saveWorldChanges(
        address,
        Number(ethers.utils.formatUnits(worldData.id, "wei")),
        { blockTotal, worldLayout },
        { increaseIds, increases, decreaseIds, decreases },
        dateTime,
        sig
      );

      if (tx) {
        toast({
          title: "Changes Submitted",
          description:
            "You have successfully submitted a transaction to save your World's changes. Please wait for this transaction to be validated by the blockchain.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setOldMetaBloxBalances(metaBloxBalances);
        setStartCheckingMetaBlox(true);
      }
    } catch (err) {
      console.log("err in saveWorldChanges ", err);
      toast({
        title: "Error Saving World Changes",
        description:
          "There was an issue saving your World's changes. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (quit && gameState !== GameState.Building) {
      quitFunction();
    }
  }, [quit]);

  return {
    values: {
      showingSomething,
      display,
      exiting,
    },
    functions: {
      setShowingSomething,
      quitFunction,
      quitWithSave,
    },
  };
};

export default useGame;
