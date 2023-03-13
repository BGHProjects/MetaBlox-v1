import { Center, chakra, HStack } from "@chakra-ui/react";
import { AnimatedDiv, AnimatedSpan } from "../AnimatedComponents";

const intro = "Welcome to the";
const splitAnimation = 3;
const firstLineAnimDuration = 4;

interface IIntroText {
  otherAnimDuration: number;
}

const IntroText = ({ otherAnimDuration }: IIntroText) => {
  return (
    <IntroContainer>
      <Center w="100%" h="100%" flexDir="column">
        <HStack spacing={5}>
          {intro.split(" ").map((char, index) => (
            <AnimatedSpan
              fontFamily="Play"
              opacity={0}
              color="white"
              fontSize="40px"
              key={index}
              //@ts-ignore
              transition={{
                delay:
                  otherAnimDuration + (index * splitAnimation) / intro.length,
                duration: firstLineAnimDuration,
                ease: "easeIn",
              }}
              animate={{
                opacity: [0, 1, 1, 1, 0],
              }}
            >
              {char}
            </AnimatedSpan>
          ))}
        </HStack>
        <HStack mt="-10" spacing={0}>
          <AnimatedSpan
            fontFamily="Aquire"
            opacity={0}
            color="white"
            fontSize="120px"
            fontWeight="bold"
            //@ts-ignore
            // @ts-ignore
            transition={{
              delay: firstLineAnimDuration * (5 / 4),
              duration: firstLineAnimDuration,
              ease: "easeIn",
            }}
            animate={{
              opacity: [0, 1, 1, 1, 0],
            }}
          >
            METAGRID
          </AnimatedSpan>
        </HStack>
      </Center>
    </IntroContainer>
  );
};

const IntroContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    w: "100%",
    h: "100vh",
    position: "absolute",
  },
});

export default IntroText;
