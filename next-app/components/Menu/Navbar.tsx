import { chakra, Flex, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavBar = () => {
  return (
    //@ts-ignore
    <Container>
      <Flex position="absolute">
        <StyledText fontSize="30px" mt="30px">
          METABLOX
        </StyledText>
      </Flex>
      <Flex alignSelf="flex-end" position="absolute" top="5" left="80%">
        <ConnectButton />
      </Flex>
    </Container>
  );
};

const Container = chakra(Flex, {
  baseStyle: {
    w: "100%",
    bg: "transparent",
    justifyContent: "center",
    flexDirection: "row",
    as: "nav",
    position: "relative",
  },
});

const StyledText = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },
});

export default NavBar;
