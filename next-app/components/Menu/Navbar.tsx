import { chakra, Flex, Text } from "@chakra-ui/react";

const NavBar = () => {
  return (
    //@ts-ignore
    <Container>
      <StyledText fontSize="30px" mt="30px">
        METABLOX
      </StyledText>
    </Container>
  );
};

const Container = chakra(Flex, {
  baseStyle: {
    w: "100%",
    bg: "transparent",
    alignItems: "center",
    flexDirection: "column",
    as: "nav",
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
