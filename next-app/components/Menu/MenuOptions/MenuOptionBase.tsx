import { chakra, Flex, Text } from "@chakra-ui/react";
import { ReactNode, useEffect, useState } from "react";
import { Content } from "../../../constants/menu";
import { useAppContext } from "../../../contexts/AppStateContext";
import { AnimatedDiv } from "../../AnimatedComponents";
import BackButton from "../BackButton";
import BlurBackground from "../BlurBackground";
import Exchange from "./Exchange";
import Grid from "./Grid";
import Marketplace from "./Marketplace";
import Sandbox from "./Sandbox";

const MenuOptionBase = () => {
  const { menuContent, setMenuContent } = useAppContext();

  const optionContent: Record<
    Content,
    { title: string; subtitle: string; content: ReactNode | ReactNode[] }
  > = {
    [Content.Exchange]: {
      title: "EXCHANGE",
      subtitle:
        "Exchange your Mumbai MATIC tokens for our MBLOX tokens to spend in the game. Current exchange rate is 0.1 MATIC for 1000 MBLOX.",
      content: <Exchange />,
    },
    [Content.Marketplace]: {
      title: "MARKETPLACE",
      subtitle:
        "Exchange your MBLOX tokens for any of our available blocks to build your world.",
      content: <Marketplace />,
    },
    [Content.Grid]: {
      title: "METAGRID",
      subtitle:
        "See all of the available worlds within our metaverse. You can purchase any available world to begin building within it. You can also view any already purchased worlds and see what people have created!",
      content: <Grid />,
    },
    [Content.Sandbox]: {
      title: "SANDBOX",
      subtitle:
        "Test, create, and experiment within our Sandbox environment. The Sandbox emulates the gameplay you would experience within one of the worlds on the MetaGrid, with an unlimited number of blocks of all types at your disposal. You won't be able to save anything you create within the Sandbox.",
      content: <Sandbox />,
    },
    [Content.None]: { title: "", subtitle: "", content: <></> },
  };

  const [initialLoad, setInitialLoad] = useState(true);
  const [exiting, setExiting] = useState(false);

  const animDuration = 0.2;

  useEffect(() => {
    setTimeout(() => {
      setInitialLoad(false);
    }, animDuration * 1000);
  }, []);

  const handleExit = () => {
    setExiting(true);
    setTimeout(() => {
      setMenuContent(Content.None);
    }, animDuration * 1000);
  };

  return (
    <>
      <OuterContainer
        // @ts-ignore
        transition={{
          duration: animDuration,
        }}
        animate={{
          opacity: initialLoad ? [0, 1] : exiting ? [1, 0] : 1,
          scale: initialLoad ? [0.9, 1] : exiting ? [1, 0.9] : 1,
        }}
      >
        <BlurBackground />
        {/* @ts-ignore */}
        <ContentContainer>
          <BackButton action={() => handleExit()} />
          <TitleText>{optionContent[menuContent].title}</TitleText>
          <SubtitleText>{optionContent[menuContent].subtitle}</SubtitleText>
          {optionContent[menuContent].content}
        </ContentContainer>
      </OuterContainer>
    </>
  );
};

const SubtitleText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontSize: "20px",
    my: "30px",
    w: "80%",
    textAlign: "center",
    fontFamily: "Play",
  },
});

const TitleText = chakra(Text, {
  baseStyle: {
    color: "white",
    fontSize: "30px",
    mt: "30px",
    fontFamily: "Aquire",
  },
});

const OuterContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    w: "100%",
    h: "100%",
    position: "relative",
  },
});

const ContentContainer = chakra(Flex, {
  baseStyle: {
    w: "100%",
    h: "100%",
    flexDirection: "column",
    position: "relative",
    alignItems: "center",
  },
});

export default MenuOptionBase;
