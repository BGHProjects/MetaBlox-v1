import { Center, chakra, VStack, Text, Spinner } from "@chakra-ui/react";
import { gridBlue } from "../../constants/colours";
import { AnimatedDiv } from "../AnimatedComponents";

interface IMetaGridFade {
  display: string;
  animDuration: number;
  exiting: boolean;
  metaGridLoaded: boolean;
}

const MetaGridFade = ({
  display,
  animDuration,
  exiting,
  metaGridLoaded,
}: IMetaGridFade) => {
  return (
    <FadeContainer
      zIndex="2"
      display={display}
      initial={{ opacity: 1 }}
      //@ts-ignore
      transition={{
        duration: animDuration,
        ease: "easeIn",
      }}
      animate={{ opacity: exiting ? [0, 1] : metaGridLoaded ? [1, 0] : 1 }}
    >
      <FadeContainer
        display={display}
        initial={{ opacity: 1 }}
        //@ts-ignore
        // @ts-ignore
        transition={{
          duration: animDuration / 6,
          ease: "easeIn",
        }}
        animate={{
          opacity: !metaGridLoaded ? [0, 1] : [1, 0],
        }}
      >
        <Center w="100%" h="100%">
          <VStack>
            <Text fontSize="40px" color="white" fontFamily="Play">
              Loading Metaverse
            </Text>
            <Spinner size="xl" color={gridBlue} />
          </VStack>
        </Center>
      </FadeContainer>
    </FadeContainer>
  );
};

const FadeContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    w: "100%",
    h: "100vh",
    bg: "black",
    position: "absolute",
    zIndex: "2",
  },
});

export default MetaGridFade;
