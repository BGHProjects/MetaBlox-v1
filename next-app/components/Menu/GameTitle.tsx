import { Center, chakra } from "@chakra-ui/react";
import { AnimatedDiv, AnimatedSpan } from "../AnimatedComponents";

interface IGameTitle {
  titleZ: number;
  initialLoadCompleted: boolean;
  moveDelay: number;
  viewMode: "PlayMode" | "ViewMode";
  METABLOX: string;
  char_anim_duration: number;
}

const GameTitle = ({
  titleZ,
  initialLoadCompleted,
  moveDelay,
  viewMode,
  METABLOX,
  char_anim_duration,
}: IGameTitle) => {
  return (
    <TitleContainer
      zIndex={titleZ}
      // @ts-ignore
      transition={{
        height: {
          delay: initialLoadCompleted ? 0 : moveDelay,
          duration: 1,
        },
      }}
      animate={{
        height: viewMode === "PlayMode" ? ["90vh", "10vh"] : ["10vh", "90vh"],
      }}
    >
      <Center boxSize="100%" position="relative">
        <AnimatedSpan
          color="white"
          fontWeight="bold"
          fontFamily="Aquire"
          // @ts-ignore
          transition={{
            duration: 1,
            fontSize: { delay: initialLoadCompleted ? 0 : moveDelay },
          }}
          animate={{
            fontSize:
              viewMode === "PlayMode" ? ["120px", "30px"] : ["30px", "120px"],
          }}
        >
          {METABLOX.split("").map((char, index) => (
            <AnimatedSpan
              key={char}
              opacity={0}
              // @ts-ignore
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
      </Center>
    </TitleContainer>
  );
};

const TitleContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    h: "100vh",
    w: "100%",
    position: "absolute",
  },
});

export default GameTitle;
