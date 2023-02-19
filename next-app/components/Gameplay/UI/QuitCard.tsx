import { Center, chakra, Text, HStack, VStack } from "@chakra-ui/react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { GameState } from "../../../constants/game";
import { useAppContext } from "../../../contexts/AppStateContext";
import useKeyboard from "../../../hooks/useKeyboard";
import { AnimatedDiv } from "../../AnimatedComponents";
import BlurBackground from "../../Menu/BlurBackground";
import QuitCardOption from "./QuitCardOption";

interface IQuitCard {
  showingSomething: boolean;
  setShowingSomething: Dispatch<SetStateAction<boolean>>;
  quitFunction: () => void;
  quitWithSave: () => Promise<void>;
}

/**
 * UI component rendered during gameplay that shows the player their options
 * should they chose to quit the game
 * @param showingSomething Whether or not the UI is showing something at the moment
 * @param setShowingSomething State function that lets the parent know that something is now showing
 * @param quitFunction Function that quits the game when pressed
 */
const QuitCard = ({
  showingSomething,
  setShowingSomething,
  quitFunction,
  quitWithSave,
}: IQuitCard) => {
  const { gameState } = useAppContext();
  const { quit, quitWithoutSaving, quitWithSaving } = useKeyboard();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (quit && gameState === GameState.Building) {
      if (!show && showingSomething) return;
      setShow(!show);
    }
  }, [quit]);

  useEffect(() => {
    if (show) {
      if (quitWithSaving) quitWithSave();
      if (quitWithoutSaving) quitFunction();
    }
  }, [quitWithSaving, quitWithoutSaving]);

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
          <HeadingLabel>Would you like to save your progress?</HeadingLabel>
          <HStack w="100%" justifyContent="space-evenly">
            <QuitCardOption saveOption /> <QuitCardOption saveOption={false} />
          </HStack>
          <CancelLabel>Press Q to Cancel</CancelLabel>
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

const CancelLabel = chakra(Text, {
  baseStyle: {
    textAlign: "center",
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

export default QuitCard;
