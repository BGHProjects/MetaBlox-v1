import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
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
  const {
    mBloxBalance,
    setOldMBloxBalance,
    metaBloxBalances,
    setOldMetaBloxBalances,
    setStartCheckingMetaBlox,
  } = useAppContext();

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

      const eu = ethers.utils;

      const dateTime = new Date().toString();

      const gameWallet = ethers.Wallet.fromMnemonic(
        process.env.NEXT_PUBLIC_GAME_WALLET_MNEMONIC as string
      );

      const data = eu.defaultAbiCoder.encode(
        ["uint256", "uint256", "address", "string"],
        [blockId, numberOfBlocks, address, dateTime]
      );

      const hash = eu.keccak256(data);

      const sig = await gameWallet.signMessage(eu.arrayify(hash));

      const tx = await GameManager.purchaseBlocks(
        blockId,
        numberOfBlocks,
        address,
        dateTime,
        sig
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

        setOldMetaBloxBalances(metaBloxBalances);
        setStartCheckingMetaBlox(true);
        setOldMBloxBalance(mBloxBalance.toString());
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
