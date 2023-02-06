import { chakra, Link, Text, useToast, VStack } from "@chakra-ui/react";
import { ethers } from "ethers";
import NextLink from "next/link";
import { useAccount, useSigner } from "wagmi";
import { getGameManagerContract } from "../../../contract-helpers/contractInstantiations";
import AppButton from "../AppButton";

const Exchange = () => {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const toast = useToast();

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
      }
    } catch (err) {
      console.log("err in convertMaticToMBlox ", err);
      toast({
        title: "Error Converting MATIC to MBLOX",
        description:
          "There was an issure converting your MATIC to MBLOX. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={10}>
      <AppButton
        w={350}
        h={60}
        title={"CONVERT MATIC TO MBLOX"}
        action={() => convertMaticToMBlox()}
      />
      {/* @ts-ignore */}
      <METRButtonExplainerText>
        If you have played{" "}
        <Link
          as={NextLink}
          href="https://github.com/BGHProjects/MetaRanger_v1"
          isExternal
          cursor="pointer"
        >
          METARANGERS
        </Link>
        , you can claim a lump sum of MBLOX tokens equal to your METR token
        balance. If you earn further METR since your last claim, you can claim
        that difference as well.
      </METRButtonExplainerText>
      <AppButton
        w={350}
        h={60}
        title={"CLAIM METR"}
        action={() => console.log("This will be implemented later")}
        metrButton
      />
    </VStack>
  );
};

const METRButtonExplainerText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    w: "80%",
    fontSize: "20px",
    fontFamily: "Play",
  },
});

export default Exchange;
