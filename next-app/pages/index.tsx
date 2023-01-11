import { Center, chakra, Flex, HStack } from "@chakra-ui/react";
import { AnimatedDiv } from "../components/AnimatedComponents";
import { MenuOption, PageComponent } from "../components/Menu";
import MenuBackground from "../components/Menu/MenuBackground/MenuBackground";
import MenuOptionBase from "../components/Menu/MenuOptions/MenuOptionBase";
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
        <MenuContentContainer>
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
          {menuContent !== Content.None && <MenuOptionBase />}
        </MenuContentContainer>
      </PageComponent>
    </>
  );
};

const MenuContentContainer = chakra(Center, {
  baseStyle: {
    mt: "100px",
    maxW: "1000px",
    w: "1000px",
    h: "600px",
    border: "1px solid gold",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
});

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
