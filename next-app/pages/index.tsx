import { Center, chakra, Flex, HStack } from "@chakra-ui/react";
import { AnimatedDiv } from "../components/AnimatedComponents";
import { MenuOption, PageComponent } from "../components/Menu";
import GameTitle from "../components/Menu/GameTitle";
import MenuBackground from "../components/Menu/MenuBackground/MenuBackground";
import MenuOptionBase from "../components/Menu/MenuOptions/MenuOptionBase";
import { Content } from "../constants/menu";
import useMainMenu from "../hooks/useMainMenu";

const MainPage = () => {
  const {
    DELAY,
    viewMode,
    menuContent,
    zIndex,
    display,
    startingGameplay,
    enteringMetaGrid,
    DURATION,
    titleZ,
    initialLoadCompleted,
    moveDelay,
    METABLOX,
    char_anim_duration,
  } = useMainMenu();

  return (
    <>
      {/* @ts-ignore */}
      <WindowContainer>
        <MenuBackground animationDelay={DELAY} />
      </WindowContainer>

      <PageComponent>
        <MenuContentContainer>
          {viewMode === "PlayMode" && (
            <>
              {menuContent === Content.None && (
                <>
                  <RowContainer>
                    <MenuOption menuOption={Content.Grid} />
                    <MenuOption menuOption={Content.Sandbox} />
                  </RowContainer>
                  <RowContainer>
                    <MenuOption menuOption={Content.Exchange} requiresWallet />
                    <MenuOption
                      menuOption={Content.Marketplace}
                      requiresWallet
                    />
                  </RowContainer>
                </>
              )}
              {menuContent !== Content.None && <MenuOptionBase />}
            </>
          )}
        </MenuContentContainer>
        <FadeContainer
          zIndex={zIndex}
          display={display}
          initial={{ opacity: 1 }}
          // @ts-ignore
          transition={{
            delay: startingGameplay || enteringMetaGrid ? 0 : DELAY,
            duration: DURATION,
            ease: "easeIn",
          }}
          animate={{
            opacity: startingGameplay || enteringMetaGrid ? [0, 1] : [1, 0],
          }}
        />
      </PageComponent>

      <GameTitle
        titleZ={titleZ}
        initialLoadCompleted={initialLoadCompleted}
        moveDelay={moveDelay}
        viewMode={viewMode}
        METABLOX={METABLOX}
        char_anim_duration={char_anim_duration}
      />
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
