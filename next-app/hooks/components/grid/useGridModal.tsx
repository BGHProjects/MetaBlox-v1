import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { GameState } from "../../../constants/game";
import { Status } from "../../../constants/worldTokens";
import { useAppContext } from "../../../contexts/AppStateContext";
import { getGameManagerContract } from "../../../contract-helpers/contractInstantiations";
import generateRandomColour from "../../../helpers/generateRandomColour";
import generateWorldNFTImage from "../../../helpers/generateWorldNFTImage";

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

  const uploadNFTData = async (colourUsed: string) => {
    /**
     * Upload the NFT metadata to Pinata
     */
    const imageSVG = generateWorldNFTImage(coords.x, coords.y, colourUsed);

    const options = {
      pinataMetadata: {
        name: `MetaBlox World X:${coords.x} Y:${coords.y}`,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    };

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([imageSVG], { type: "image/svg+xml" }),
      `metablox_world_svg_x${coords.x}_y${coords.y}.svg`
    );
    formData.append("pinataMetadata", JSON.stringify(options.pinataMetadata));
    formData.append("pinataOptions", JSON.stringify(options.pinataOptions));

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
      }
    );

    const metadataJSON = {
      name: `MetaBlox World X:${coords.x} Y:${coords.y}`,
      description: `The NFT token for the MetaBlox World located at position X:${coords.x} Y:${coords.y}`,
      image: `ipfs://${res.data.IpfsHash}`,
      attributes: [
        {
          trait_type: "X Coordinate",
          value: coords.x,
        },
        {
          trait_type: "Y Coordinate",
          value: coords.y,
        },
        {
          trait_type: "World Colour",
          value: colourUsed,
        },
      ],
    };

    const data = JSON.stringify(metadataJSON);
    const config = {
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
      },
      data,
    };

    const finalRes = await axios(config);

    return finalRes.data.IpfsHash;
  };

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

      const ipfsHash = uploadNFTData(colourUsed);

      const newWorldDetails = {
        tokenURI: `ipfs://${ipfsHash}`,
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
