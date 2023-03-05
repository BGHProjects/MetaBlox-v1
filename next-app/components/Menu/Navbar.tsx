import { chakra, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppStateContext";
import { AnimatedSpan } from "../AnimatedComponents";
import AppButton from "./AppButton";
import WalletConnectButton from "./WalletConnectButton";

const METABLOX = "METABLOX";
const char_anim_duration = 1;
const moveDelay = 3;

const NavBar = () => {
  const { viewMode, setViewMode } = useAppContext();
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(false);

  const handleChangeMode = () => {
    if (viewMode === "ViewMode") {
      setViewMode("PlayMode");
      return;
    }

    setViewMode("ViewMode");
  };

  useEffect(() => {
    setTimeout(() => {
      setInitialLoadCompleted(true);
    }, moveDelay * 1000);
  }, []);

  return (
    <Flex position="absolute" top="0" w="100%">
      {/* @ts-ignore */}
      <Container>
        <Flex position="absolute" zIndex="3">
          <AnimatedSpan
            color="white"
            fontWeight="bold"
            fontFamily="Aquire"
            transition={{
              duration: 1,
              fontSize: { delay: initialLoadCompleted ? 0 : moveDelay },
              marginTop: { delay: initialLoadCompleted ? 0 : moveDelay },
            }}
            animate={{
              fontSize:
                viewMode === "PlayMode" ? ["120px", "30px"] : ["30px", "120px"],
              marginTop:
                viewMode === "PlayMode" ? ["300px", "10px"] : ["10px", "300px"],
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
        <Flex alignSelf="flex-end" position="absolute" top="5" right="5">
          <WalletConnectButton />
        </Flex>
        <Flex alignSelf="flex-end" position="absolute" top="5" left="5">
          <AppButton
            h={40}
            w={200}
            title={viewMode === "ViewMode" ? "Play Mode" : "View Mode"}
            action={handleChangeMode}
          />
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
