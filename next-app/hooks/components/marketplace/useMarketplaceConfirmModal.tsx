import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import { Block, blockPrices } from "../../../constants/blocks";
import { useAppContext } from "../../../contexts/AppStateContext";
import { getGameManagerContract } from "../../../contract-helpers/contractInstantiations";

/**
 * Hook that separates the logic of the Marketplace Confirm Modal with the JSX
 * @param block The type of block that is possibly being purchased by the user
 * @param closeFunction Function that closes the modal
 */
const useMarketplaceConfirmModal = (
  block: Block,
  closeFunction: () => void
) => {
  const [numberOfBlocks, setNumberOfBlocks] = useState(1);
  const [price, setPrice] = useState(numberOfBlocks * blockPrices[block]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { mBloxBalance, setExpectedMBloxBalance } = useAppContext();

  useEffect(() => {
    setPrice(numberOfBlocks * blockPrices[block]);
  }, [numberOfBlocks]);

  const handlePurchase = async () => {
    if (price > mBloxBalance) {
      toast({
        title: "Insufficient MBlox",
        description: "You do not have enough MBlox to complete this purchase",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
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
      const GameManager = getGameManagerContract(signer);

      const blockId = Object.values(Block).findIndex(
        (element) => element === block
      );

      const tx = await GameManager.purchaseBlocks(
        process.env.NEXT_PUBLIC_TEST_DIGITAL_KEY,
        blockId,
        numberOfBlocks,
        address
      );

      if (tx) {
        toast({
          title: "Transaction submitted",
          description:
            "You have successfully submitted a transaction to purchase MetaBlox. Please wait for this transaction to be validated by the blockchain.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setExpectedMBloxBalance(mBloxBalance - price);
        setLoading(false);
        closeFunction();
      }
    } catch (err) {
      setLoading(false);
      console.log("err in convertMaticToMBlox ", err);
      toast({
        title: "Error Purchasing MetaBlox",
        description:
          "There was an issue when completing this purchase. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return { price, setNumberOfBlocks, handlePurchase, loading };
};

export default useMarketplaceConfirmModal;
