import { Center, chakra, Flex, Image } from "@chakra-ui/react";
import { useState } from "react";
import { Content } from "../../constants/menu";
import { useAppContext } from "../../contexts/AppStateContext";
import { AnimatedDiv, AnimatedSpan } from "../AnimatedComponents";
import BlurBackground from "./BlurBackground";

interface IMenuOption {
  menuOption: Content;
}

const ANIM_DURATION = 0.3;

const MenuOption = ({ menuOption }: IMenuOption) => {
  const { setMenuContent, setCursorDefault, setCursorHover } = useAppContext();
  const [hovering, setHovering] = useState(false);
  const [justRendered, setJustRendered] = useState(true);

  const optionLabel: Record<Content, string> = {
    [Content.Exchange]: "EXCHANGE",
    [Content.Marketplace]: "MARKETPLACE",
    [Content.Grid]: "GRID",
    [Content.Sandbox]: "SANDBOX",
    [Content.None]: "NONE",
  };

  const handleEnter = () => {
    setJustRendered(false);
    setCursorHover();
    setHovering(true);
  };

  const handleLeave = () => {
    setCursorDefault();
    setHovering(false);
  };

  const handleClick = () => {
    setCursorDefault();
    setMenuContent(menuOption);
  };

  return (
    <>
      {/*@ts-ignore */}
      <TotalContainer
        onMouseEnter={() => handleEnter()}
        onMouseLeave={() => handleLeave()}
        onClick={() => handleClick()}
        //@ts-ignore
        transition={{
          duration: ANIM_DURATION,
          ease: "easeInOut",
        }}
        animate={{
          scale: hovering ? [1, 1.1] : justRendered ? 1 : [1.1, 1],
        }}
      >
        <BlurBackground />
        {/*@ts-ignore */}
        <OptionContainer>
          <ContainerCenterer>
            <OptionIcon
              //@ts-ignore
              transition={{
                duration: ANIM_DURATION,
              }}
              animate={{
                opacity: hovering ? 0 : 1,
              }}
            >
              <Image w="100%" h="100%" src="/images/test_circle.svg" />
            </OptionIcon>
            <TextCenterer>
              {optionLabel[menuOption].split("").map((char, index) => (
                <AnimatedSpan
                  opacity={0}
                  color="white"
                  fontSize="40px"
                  fontWeight="bold"
                  key={index}
                  //@ts-ignore
                  transition={{
                    delay: hovering
                      ? ANIM_DURATION +
                        (index * ANIM_DURATION) / optionLabel[menuOption].length
                      : 0,
                    duration: hovering ? ANIM_DURATION / 4 : 0,
                    ease: "easeIn",
                  }}
                  animate={{
                    opacity: hovering ? [0, 1] : 0,
                    y: hovering ? [10, 0] : 0,
                  }}
                >
                  {char}
                </AnimatedSpan>
              ))}
            </TextCenterer>
          </ContainerCenterer>
        </OptionContainer>
      </TotalContainer>
    </>
  );
};

const TextCenterer = chakra(Center, {
  baseStyle: {
    w: "100%",
    h: "100%",
    position: "absolute",
  },
});

const OptionIcon = chakra(AnimatedDiv, {
  shouldForwardProps: () => true,
  baseStyle: {
    position: "absolute",
    w: "70%",
    h: "70%",
  },
});

const ContainerCenterer = chakra(Center, {
  baseStyle: {
    w: "100%",
    h: "100%",
    position: "relative",
  },
});

const TotalContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    position: "relative",
    w: "400px",
    minW: "400px",
    h: "200px",
    borderRadius: "10px",
  },
});

const OptionContainer = chakra(Flex, {
  baseStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    w: "100%",
    h: "100%",
    borderRadius: "10px",
  },
});

export default MenuOption;
