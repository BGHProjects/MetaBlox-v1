import { chakra, Link, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import useExchange from "../../../hooks/components/useExchange";
import AppButton from "../AppButton";

const Exchange = () => {
  const { convertMaticToMBlox, claimMETRBalance } = useExchange();

  return (
    <VStack spacing={10}>
      <AppButton
        w={350}
        h={60}
        title={"CONVERT MATIC TO MBLOX"}
        action={convertMaticToMBlox}
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
        action={claimMETRBalance}
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
