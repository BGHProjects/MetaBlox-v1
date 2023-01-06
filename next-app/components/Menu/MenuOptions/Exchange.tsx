import { VStack, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useAppContext } from "../../../contexts/AppStateContext";
import AppButton from "../AppButton";

const Exchange = () => {
  const { setCursorDefault, setCursorHover } = useAppContext();

  return (
    <VStack spacing={10}>
      <AppButton
        w={350}
        h={60}
        title={"CONVERT MATIC TO MBLOX"}
        action={() => console.log("This will be implemented later")}
      />
      <Text color="white" textAlign="center" w="80%" fontSize={20}>
        If you have played{" "}
        <Link
          as={NextLink}
          href="https://github.com/BGHProjects/MetaRanger_v1"
          isExternal
          cursor="none"
          onMouseEnter={() => setCursorHover()}
          onMouseLeave={() => setCursorDefault()}
        >
          METARANGERS
        </Link>
        , you can claim a lump sum of MBLOX tokens equal to your METR token
        balance. If you earn further METR since your last claim, you can claim
        that difference as well.
      </Text>
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

export default Exchange;
