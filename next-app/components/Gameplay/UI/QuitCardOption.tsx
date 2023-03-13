import { VStack, Center, Text, chakra } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { buttonBG } from "../../../constants/colours";
import useKeyboard from "../../../hooks/useKeyboard";
import { AnimatedDiv } from "../../AnimatedComponents";

interface IQuitCardOption {
  saveOption: boolean;
}

const size = "50px";

/**
 * UI representation of saving or not saving, rendered in the QuitCard
 * @param saveOption Boolean which determines if this button saves changes or not
 */
const QuitCardOption = ({ saveOption }: IQuitCardOption) => {
  const { quitWithoutSaving, quitWithSaving } = useKeyboard();
  const [triggered, setTriggered] = useState(false);

  const displayItems: Record<string, { button: string; label: string }> = {
    true: { button: "Y", label: "save and quit" },
    false: { button: "N", label: "quit" },
  };

  useEffect(() => {
    if (saveOption ? quitWithSaving : quitWithoutSaving) {
      setTriggered(true);
    }
  }, [quitWithSaving, quitWithoutSaving]);

  return (
    <VStack spacing={3} w="100px">
      <ButtonContainer
        // @ts-ignore
        transition={{
          duration: 0.5,
        }}
        animate={{
          scale: triggered ? [1, 1.3, 1] : 1,
        }}
      >
        <LabelContainer>
          {/* @ts-ignore */}
          <ButtonLabel>
            {displayItems[saveOption.toString()].button}
          </ButtonLabel>
        </LabelContainer>
      </ButtonContainer>
      {/* @ts-ignore */}
      <ButtonExplanation>
        {`Press ${displayItems[saveOption.toString()].button} to ${
          displayItems[saveOption.toString()].label
        }`}
      </ButtonExplanation>
    </VStack>
  );
};

const LabelContainer = chakra(Center, {
  baseStyle: {
    w: "100%",
    h: "100%",
    borderRadius: "10px",
  },
});

const ButtonContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    bgGradient: buttonBG,
    borderRadius: "10px",
    border: "1px solid white",
    h: size,
    w: size,
  },
});

const ButtonLabel = chakra(Text, {
  baseStyle: {
    color: "white",
    fontSize: "30px",
    fontFamily: "Play",
  },
});

const ButtonExplanation = chakra(Text, {
  baseStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Play",
  },
});

export default QuitCardOption;
