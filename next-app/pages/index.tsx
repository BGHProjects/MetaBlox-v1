import { Center, chakra, Flex, HStack } from "@chakra-ui/react";
import { AnimatedDiv } from "../components/AnimatedComponents";
import {
  Exchange,
  Grid,
  Marketplace,
  MenuOption,
  PageComponent,
  Sandbox,
} from "../components/Menu";
import MenuBackground from "../components/Menu/MenuBackground/MenuBackground";
import { Content } from "../constants/menu";
import { useAppContext } from "../contexts/AppStateContext";

const MainPage = () => {
  const { menuContent } = useAppContext();

  return (
    <>
      {/*//@ts-ignore */}
      <WindowContainer>
        <MenuBackground />
      </WindowContainer>
      <FadeContainer
        initial={{ opacity: 1 }}
        //@ts-ignore
        transition={{
          duration: 1,
          ease: "easeIn",
        }}
        animate={{ opacity: [1, 0] }}
      />
      <PageComponent>
        <Center
          mt="50px"
          maxW="1000px"
          w="1000px"
          h="600px"
          border="1px solid gold"
          flexDirection="column"
          justifyContent="space-evenly"
        >
          {menuContent === Content.None && (
            <>
              {/*//@ts-ignore */}
              <RowContainer>
                <MenuOption menuOption={Content.Grid} />
                <MenuOption menuOption={Content.Sandbox} />
              </RowContainer>
              <RowContainer>
                <MenuOption menuOption={Content.Exchange} />
                <MenuOption menuOption={Content.Marketplace} />
              </RowContainer>
            </>
          )}
          {menuContent === Content.Grid && <Grid />}
          {menuContent === Content.Sandbox && <Sandbox />}
          {menuContent === Content.Marketplace && <Marketplace />}
          {menuContent === Content.Exchange && <Exchange />}
        </Center>
      </PageComponent>
    </>
  );
};

const FadeContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    w: "100%",
    h: "100vh",
    bg: "black",
    position: "absolute",
  },
});

const RowContainer = chakra(HStack, {
  baseStyle: {
    w: "100%",
    h: "fit-content",
    justifyContent: "space-evenly",
  },
});

const WindowContainer = chakra(Flex, {
  baseStyle: {
    h: "100vh",
    w: "100%",
    position: "absolute",
  },
});

export default MainPage;
