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

/**
 * Common component that represents the button used throughout the app
 * @param h The height of the button
 * @param w The width of the button
 * @param title The text that is displayed on the button
 * @param action The action that is performed by pressing the button
 * @param fontSize The size of the font of the text within the button
 * @param component The component that is rendered within the button
 * @param metrButton Whether or not this button is the METR Button
 */
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
            <METRLabel fontSize={fontSize ? `${fontSize}px` : "30px"}>
              {title}
            </METRLabel>
          </HStack>
        ) : (
          component ?? (
            <>
              {/* @ts-ignore */}
              <ButtonLabel fontSize={fontSize ? `${fontSize}px` : "20px"}>
                {title}
              </ButtonLabel>
            </>
          )
        )}
      </Center>
    </AnimatedDiv>
  );
};

const ButtonLabel = chakra(Text, {
  baseStyle: {
    fontFamily: "Play",
    textAlign: "center",
    color: "white",
  },
});

const METRLabel = chakra(Text, {
  baseStyle: {
    textAlign: "center",
    color: "white",
    fontFamily: "Iceland",
  },
});

export default AppButton;
