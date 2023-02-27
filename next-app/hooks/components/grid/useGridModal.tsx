import { useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { GameState } from "../../../constants/game";
import { Status } from "../../../constants/worldTokens";
import { useAppContext } from "../../../contexts/AppStateContext";
import { getGameManagerContract } from "../../../contract-helpers/contractInstantiations";
import generateRandomColour from "../../../helpers/generateRandomColour";

/**
 * Hook that separates the logic of the Grid Modal Content from its JSX
 */
const useGridModal = (
  x: number,
  y: number,
  status: Status,
  closeFunction: () => void,
  worldId: number | undefined
) => {
  const {
    setStartingGameplay,
    setGameState,
    mBloxBalance,
    playerColour,
    usedColours,
    setOldMBloxBalance,
    gridData,
    setOldGridData,
    setStartCheckingGridData,
    setGameplayMetaBlox,
    metaBloxBalances,
    retrieveWorldData,
  } = useAppContext();
  const coords = { x, y };
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const handleClick = async () => {
    // If not purchasing World, enter World accordingly
    if (status !== Status.Vacant) {
      setGameState(
        status === Status.Owned ? GameState.Building : GameState.Visiting
      );
      setGameplayMetaBlox(metaBloxBalances);

      if (worldId) retrieveWorldData(worldId);

      setStartingGameplay(true);
      closeFunction();
      return;
    }

    if (mBloxBalance < 100) {
      toast({
        title: "Insufficient MBlox ",
        description: "You do not have enough MBlox to complete this purchase",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

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
      setLoading(true);
      /**
       * Construct World Metadata
       *  1. tokenUri
       *  2. id (Set to zero, because it is assigned in the contract)
       *  3. colour
       *  4. worldBlockDetails
       *      4a. blockTotal
       *      4b. worldLayout
       *  5. worldGridData
       *      5a. owner
       *      5b. coords
       *          5bi. x
       *          5bii. y
       */

      // This is for initial testing only
      // need to update with complete values latter

      let colourUsed = "";

      const generateNewColour = (): string => {
        let colour = generateRandomColour();
        if (usedColours.length === 0) return colour;
        if (!usedColours.includes(colour)) return colour;

        return generateNewColour();
      };

      if (!playerColour) {
        colourUsed = generateNewColour();
      } else {
        colourUsed = playerColour;
      }

      const newWorldDetails = {
        tokenURI: "https://tokenURI",
        id: 0,
        colour: colourUsed,
        worldBlockDetails: {
          blockTotal: 0,
          worldLayout: "[]",
        },
        worldGridData: {
          owner: address,
          coords: {
            x: coords.x,
            y: coords.y,
          },
        },
      };

      const GameManager = getGameManagerContract(signer);

      const tx = await GameManager.purchaseWorld(
        process.env.NEXT_PUBLIC_TEST_DIGITAL_KEY,
        newWorldDetails,
        address
      );

      if (tx) {
        toast({
          title: "Transaction submitted",
          description:
            "You have successfully submitted a transaction to purchase a World. Please wait for this transaction to be validated by the blockchain.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setOldMBloxBalance(mBloxBalance.toString());
        setOldGridData(gridData);
        setStartCheckingGridData(true);
        setLoading(false);
        closeFunction();
      }
    } catch (err) {
      setLoading(false);
      console.log("err in handleClick ", err);
      toast({
        title: "Error Purchasing World",
        description:
          "There was an issue when completing this purchase. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return { coords, handleClick, loading };
};

export default useGridModal;
