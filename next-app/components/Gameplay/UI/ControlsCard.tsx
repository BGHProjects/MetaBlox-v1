import { Center, chakra, Text, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { GameState } from "../../../constants/game";
import { useAppContext } from "../../../contexts/AppStateContext";
import useKeyboard from "../../../hooks/useKeyboard";
import { AnimatedDiv } from "../../AnimatedComponents";
import BlurBackground from "../../Menu/BlurBackground";

interface IControlsCard {
  showingSomething: boolean;
  setShowingSomething: Dispatch<SetStateAction<boolean>>;
}

/**
 * UI component in gameplay that shows the user what the controls are
 * @param showingSomething Whether or not the UI is showing something at the moment
 * @param setShowingSomething State function that lets the parent know that something is now showing
 */
const ControlsCard = ({
  showingSomething,
  setShowingSomething,
}: IControlsCard) => {
  const [show, setShow] = useState(false);
  const { toggleControls } = useKeyboard();
  const { gameState } = useAppContext();

  useEffect(() => {
    if (toggleControls) {
      if (!show && showingSomething) return;
      setShow(!show);
    }
  }, [toggleControls]);

  useEffect(() => {
    setShowingSomething(show);
  }, [show]);

  return (
    <AnimContainer
      // @ts-ignore
      transition={{
        duration: 0.5,
      }}
      animate={{
        opacity: show ? [0, 1] : [1, 0],
      }}
    >
      <CardContainer>
        <BlurBackground />
        <VStack zIndex="1" spacing={5}>
          {/* @ts-ignore */}
          <HeadingLabel>CONTROLS</HeadingLabel>
          <ContentLabel>
            Use the WASD Keys to move Forward, Left, Backward, and Right
            respectively.
          </ContentLabel>
          <ContentLabel>
            Hold Shift and use the WASD Keys to sprint
          </ContentLabel>
          <ContentLabel>Press SpaceBar to jump.</ContentLabel>
          {(gameState === GameState.Building ||
            gameState === GameState.Sandbox) && (
            <VStack zIndex="1" spacing={5}>
              <ContentLabel>
                Use the Number Keys to select which cube you would like to use.
              </ContentLabel>
              <ContentLabel>
                Click the Left Mouse Button to place a block.
              </ContentLabel>
              <ContentLabel>
                Hold ALT and click the Left Mouse Button to remove a block.
              </ContentLabel>
            </VStack>
          )}

          <ContentLabel>Press C to close these instructions.</ContentLabel>
        </VStack>
      </CardContainer>
    </AnimContainer>
  );
};

const AnimContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    h: "fit-content",
    w: "fit-content",
  },
});

const ContentLabel = chakra(Text, {
  baseStyle: {
    color: "white",
    fontFamily: "Play",
  },
});

const HeadingLabel = chakra(Text, {
  baseStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
    fontFamily: "Play",
  },
});

const CardContainer = chakra(Center, {
  baseStyle: {
    w: "fit-content",
    h: "fit-content",
    p: "20px",
    position: "absolute",
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    m: "auto",
    borderRadius: "10px",
    flexDirection: "column",
    alignItems: "center",
  },
});

export default ControlsCard;
