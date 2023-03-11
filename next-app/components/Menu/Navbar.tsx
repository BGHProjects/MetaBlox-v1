import { chakra, Flex } from "@chakra-ui/react";
import { useAppContext } from "../../contexts/AppStateContext";
import AppButton from "./AppButton";
import WalletConnectButton from "./WalletConnectButton";

const NavBar = () => {
  const { viewMode, setViewMode } = useAppContext();

  const handleChangeMode = () => {
    if (viewMode === "ViewMode") {
      setViewMode("PlayMode");
      return;
    }

    setViewMode("ViewMode");
  };

  return (
    <Flex position="absolute" top="0" w="100%">
      {/* @ts-ignore */}
      <Container>
        <Flex alignSelf="flex-end" position="absolute" top="5" right="5">
          <WalletConnectButton />
        </Flex>
        <Flex alignSelf="flex-end" position="absolute" top="5" left="5">
          <AppButton
            h={40}
            w={200}
            title={viewMode === "ViewMode" ? "Play Mode" : "View Mode"}
            action={handleChangeMode}
          />
        </Flex>
      </Container>
    </Flex>
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

export default NavBar;
