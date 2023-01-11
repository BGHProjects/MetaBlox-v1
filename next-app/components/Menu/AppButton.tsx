import { Center, chakra, HStack, Image, Text } from "@chakra-ui/react";
import { ReactNode, useState } from "react";
import { buttonBG, metrButtonBG } from "../../constants/colours";
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
  const [hovering, setHovering] = useState(false);
  const [justRendered, setJustRendered] = useState(true);

  const handleEnter = () => {
    setJustRendered(false);
    setHovering(true);
  };

  return (
    <AnimatedDiv
      h={`${h}px`}
      w={`${w}px`}
      onMouseEnter={() => handleEnter()}
      onMouseLeave={() => setHovering(false)}
      onClick={() => action()}
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
      cursor="pointer"
    >
      <Center w="100%" h="100%">
        {metrButton ? (
          <HStack>
            <Image src="/images/METR_icon.svg" />
            <Text
              textAlign="center"
              color="white"
              fontSize={fontSize ? `${fontSize}px` : "30px"}
              fontFamily="Iceland"
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
