import { Center, chakra, Text, HStack, VStack } from "@chakra-ui/react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import useKeyboard from "../../../hooks/useKeyboard";
import BlurBackground from "../../Menu/BlurBackground";
import QuitCardOption from "./QuitCardOption";

interface IQuitCard {
  setShowingSomething: Dispatch<SetStateAction<boolean>>;
  quitFunction: () => void;
}

const QuitCard = ({ setShowingSomething, quitFunction }: IQuitCard) => {
  const { quit, quitWithoutSaving, quitWithSaving } = useKeyboard();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (quit) {
      setShow(!show);
    }
  }, [quit]);

  useEffect(() => {
    if (show) {
      if (quitWithSaving) quitFunction();
      if (quitWithoutSaving) quitFunction();
    }
  }, [quitWithSaving, quitWithoutSaving]);

  useEffect(() => {
    setShowingSomething(show);
  }, [show]);

  return (
    show && (
      <CardContainer>
        <BlurBackground />
        <VStack zIndex="1" spacing={5}>
          {/* @ts-ignore */}
          <HeadingLabel>Would you like to save your progress?</HeadingLabel>
          <HStack w="100%" justifyContent="space-evenly">
            <QuitCardOption saveOption /> <QuitCardOption saveOption={false} />
          </HStack>
          <Text textAlign="center" color="white">
            Press Q to Cancel
          </Text>
        </VStack>
      </CardContainer>
    )
  );
};

const HeadingLabel = chakra(Text, {
  baseStyle: {
    color: "white",
    fontWeight: "bold",
    fontSize: "20px",
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
