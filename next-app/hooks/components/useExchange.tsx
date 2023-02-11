import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useAccount, useBalance, useSigner } from "wagmi";
import { useAppContext } from "../../contexts/AppStateContext";
import { getGameManagerContract } from "../../contract-helpers/contractInstantiations";

/**
 * Hook used to handle the logic of the Exchange component of the Main Menu
 * @returns convertMaticToMBlox function
 */
const useExchange = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const toast = useToast();
  const { mBloxBalance, setExpectedMBloxBalance } = useAppContext();

  const { data: METRBalance } = useBalance({
    address: address,
    chainId: 80001,
    token: process.env.NEXT_PUBLIC_METR_TOKEN_ADDRESS as `0x${string}`,
  });

  /**
   * Converts the user's inputted Matic into the MBlox token
   */
  const convertMaticToMBlox = async () => {
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
      const contract = getGameManagerContract(signer);

      const tx = await contract.convertMATICtoMBLOX(
        process.env.NEXT_PUBLIC_TEST_DIGITAL_KEY,
        address,
        { value: ethers.utils.parseEther("0.1") }
      );

      if (tx) {
        toast({
          title: "Transaction submitted",
          description:
            "You have successfully submitted a transaction to convert your MATIC into MBLOX. Please wait for this transaction to be validated by the blockchain.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        setExpectedMBloxBalance(mBloxBalance + 1000);
      }
    } catch (err) {
      console.log("err in convertMaticToMBlox ", err);
      toast({
        title: "Error Converting MATIC to MBLOX",
        description:
          "There was an issue converting your MATIC to MBLOX. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const claimMETRBalance = async () => {
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
      const currentMETRBalance = Number(METRBalance?.formatted);

      if (Number(METRBalance?.formatted) === 0.0) {
        toast({
          title: "No METR Balance",
          description:
            "You do not own any METR. Come back and claim your balance once you have played METARANGERS.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const contract = getGameManagerContract(signer);

      const claimedMETRBalance = await contract.getPlayerMETRBalance(address);
      const formattedClaimedMETR = Number(
        ethers.utils.formatUnits(claimedMETRBalance)
      );

      if (currentMETRBalance <= formattedClaimedMETR) {
        toast({
          title: "No METR to Claim",
          description:
            "You have not accrued any more METR since your last claim. Come back and claim your balance once you have played more METARANGERS.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const tx = await contract.claimMETRBalance(
        process.env.NEXT_PUBLIC_TEST_DIGITAL_KEY,
        address
      );

      if (tx) {
        toast({
          title: "Transaction submitted",
          description:
            "You have successfully submitted a transaction to claim your METR Balance. Please wait for this transaction to be validated by the blockchain.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      setExpectedMBloxBalance(
        mBloxBalance + (currentMETRBalance - formattedClaimedMETR)
      );
    } catch (err) {
      console.log("err in claimMETRBalance ", err);
      toast({
        title: "Error Claiming METR Balance",
        description:
          "There was an issue claiming your METR Balance. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return { convertMaticToMBlox, claimMETRBalance };
};

export default useExchange;