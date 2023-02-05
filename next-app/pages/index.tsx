import { Center, chakra, Flex, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AnimatedDiv } from "../components/AnimatedComponents";
import { MenuOption, PageComponent } from "../components/Menu";
import MenuBackground from "../components/Menu/MenuBackground/MenuBackground";
import MenuOptionBase from "../components/Menu/MenuOptions/MenuOptionBase";
import { Content } from "../constants/menu";
import { useAppContext } from "../contexts/AppStateContext";

const DELAY = 3;
const DURATION = 2;

const MainPage = () => {
  const { menuContent, setMenuContent, startingGameplay } = useAppContext();
  const [display, setDisplay] = useState("flex");
  const [zIndex, setZIndex] = useState("1");
  const router = useRouter();

  useEffect(() => {
    setMenuContent(Content.None);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setDisplay("none");
    }, (DELAY + DURATION) * 1000);
  }, []);

  useEffect(() => {
    if (startingGameplay) {
      setZIndex("3");
      setDisplay("flex");
      setTimeout(() => {
        router.push("/game");
      }, 3000);
    }
  }, [startingGameplay]);

  return (
    <>
      <WindowContainer>
        <MenuBackground animationDelay={DELAY} />
      </WindowContainer>

      <PageComponent>
        <MenuContentContainer>
          {menuContent === Content.None && (
            <>
              <RowContainer>
                <MenuOption menuOption={Content.Grid} />
                <MenuOption menuOption={Content.Sandbox} />
              </RowContainer>
              <RowContainer>
                <MenuOption menuOption={Content.Exchange} requiresWallet />
                <MenuOption menuOption={Content.Marketplace} requiresWallet />
              </RowContainer>
            </>
          )}
          {menuContent !== Content.None && <MenuOptionBase />}
        </MenuContentContainer>
        <FadeContainer
          zIndex={zIndex}
          display={display}
          initial={{ opacity: 1 }}
          //@ts-ignore
          transition={{
            delay: startingGameplay ? 0 : DELAY,
            duration: DURATION,
            ease: "easeIn",
          }}
          animate={{ opacity: startingGameplay ? [0, 1] : [1, 0] }}
        />
      </PageComponent>
    </>
  );
};

const MenuContentContainer = chakra(Center, {
  baseStyle: {
    mt: "60px",
    maxW: "1000px",
    w: "1000px",
    h: "600px",
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
