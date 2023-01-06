import { Center, chakra, HStack, Text, Image } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { buttonBG, metrButtonBG } from "../../constants/colours";
import { useAppContext } from "../../contexts/AppStateContext";
import { AnimatedDiv } from "../AnimatedComponents";

const ANIM_DURATION = 0.3;

interface IAppButton {
  h: number;
  w: number;
  title?: string;
  action: () => void;
  fontSize?: number;
  component?: ReactNode | ReactNode[];
  metrButton?: boolean;
}

const AppButton = ({
  h,
  w,
  title,
  action,
  fontSize,
  component,
  metrButton,
}: IAppButton) => {
  const { setCursorDefault, setCursorHover } = useAppContext();
  const [hovering, setHovering] = useState(false);
  const [justRendered, setJustRendered] = useState(true);

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
    action();
  };

  return (
    <AnimatedDiv
      h={`${h}px`}
      w={`${w}px`}
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
      bgGradient={metrButton ? metrButtonBG : buttonBG}
      borderRadius="10px"
    >
      <Center w="100%" h="100%">
        {metrButton ? (
          <HStack>
            <Image src="/images/METR_icon.svg" />
            <Text
              textAlign="center"
              color="white"
              fontSize={fontSize ? `${fontSize}px` : "30px"}
              fontFamily="metr"
            >
              {title}
            </Text>
          </HStack>
        ) : (
          component ?? (
            <Text
              textAlign="center"
              color="white"
              fontSize={fontSize ? `${fontSize}px` : "20px"}
            >
              {title}
            </Text>
          )
        )}
      </Center>
    </AnimatedDiv>
  );
};

const StyledButton = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {},
});

export default AppButton;
