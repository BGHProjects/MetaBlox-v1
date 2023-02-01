import { chakra, Flex } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AnimatedSpan } from "../AnimatedComponents";

const METABLOX = "METABLOX";
const char_anim_duration = 1;
const moveDelay = 3;

const NavBar = () => {
  return (
    <Flex position="absolute" top="0" w="100%">
      {/*@ts-ignore */}
      <Container>
        <Flex position="absolute" zIndex="3">
          <AnimatedSpan
            color="white"
            fontWeight="bold"
            fontFamily="Aquire"
            transition={{
              duration: 1,
              fontSize: { delay: moveDelay },
              marginTop: { delay: moveDelay },
            }}
            animate={{
              fontSize: ["120px", "30px"],
              marginTop: ["300px", "10px"],
            }}
          >
            {METABLOX.split("").map((char, index) => (
              <AnimatedSpan
                key={char}
                opacity={0}
                transition={{
                  opacity: {
                    delay: 1 + (index * char_anim_duration) / METABLOX.length,
                    duration: char_anim_duration / 2,
                  },
                }}
                animate={{
                  opacity: [0, 1],
                }}
              >
                {char}
              </AnimatedSpan>
            ))}
          </AnimatedSpan>
        </Flex>
        <Flex alignSelf="flex-end" position="absolute" top="5" left="80%">
          <ConnectButton />
        </Flex>
      </Container>
    </Flex>
  );
};

const Container = chakra(Flex, {
  baseStyle: {
    w: "100%",
    bg: "transparent",
    justifyContent: "center",
    flexDirection: "row",
    as: "nav",
    position: "relative",
  },
});

export default NavBar;
