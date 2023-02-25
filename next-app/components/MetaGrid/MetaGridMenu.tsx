import { chakra, Text, Center, HStack } from "@chakra-ui/react";
import BlurBackground from "../Menu/BlurBackground";

const MetaGridMenu = () => {
  return (
    <TextContainer>
      <BlurBackground />
      <HStack spacing={10} zIndex="1">
        {/* @ts-ignore */}
        <HelpText>Press C for Controls</HelpText>
        <HelpText>Press Q to Quit</HelpText>
      </HStack>
    </TextContainer>
  );
};

const HelpText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontFamily: "Play",
  },
});

const TextContainer = chakra(Center, {
  baseStyle: {
    w: "fit-content",
    p: "10px",
    h: "fit-content",
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    m: "auto",
    borderRadius: "10px",
    flexDirection: "column",
  },
});

export default MetaGridMenu;
