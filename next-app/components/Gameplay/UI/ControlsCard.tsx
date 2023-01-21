import { Center, chakra, Text, VStack } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useKeyboard from "../../../hooks/useKeyboard";
import BlurBackground from "../../Menu/BlurBackground";

interface IControlsCard {
  setShowingSomething: Dispatch<SetStateAction<boolean>>;
}

const ControlsCard = ({ setShowingSomething }: IControlsCard) => {
  const [show, setShow] = useState(false);
  const { toggleControls } = useKeyboard();

  useEffect(() => {
    if (toggleControls) setShow(!show);
  }, [toggleControls]);

  useEffect(() => {
    setShowingSomething(show);
  }, [show]);

  return (
    show && (
      <CardContainer>
        <BlurBackground />
        <VStack zIndex="1" spacing={5}>
          {/* @ts-ignore */}
          <HeadingLabel>CONTROLS</HeadingLabel>
          <ContentLabel>
            Use the Number Keys to select which cube you would like to use.
          </ContentLabel>
          <ContentLabel>
            Use the WASD Keys to move Forward, Left, Backward, and Right
            respectively.
          </ContentLabel>
          <ContentLabel>Press SpaceBar to jump.</ContentLabel>
          <ContentLabel>
            Click the Left Mouse Button to place a block.
          </ContentLabel>
          <ContentLabel>
            Hold ALT and click the Left Mouse Button to remove a block.
          </ContentLabel>
          <ContentLabel>Press C to close these instructions.</ContentLabel>
        </VStack>
      </CardContainer>
    )
  );
};

const ContentLabel = chakra(Text, {
  baseStyle: {
    color: "white",
  },
});

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

export default ControlsCard;
