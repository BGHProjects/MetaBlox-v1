import { chakra, Flex, Center, VStack, Text, Spinner } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatedDiv, AnimatedSpan } from "../components/AnimatedComponents";
import { FPV, Player } from "../components/Gameplay";
import Cubes from "../components/Gameplay/Cubes/Cubes";
import GridTile from "../components/MetaGrid/GridTile";
import MetaGridMenu from "../components/MetaGrid/MetaGridMenu";
import { gridBlue } from "../constants/colours";
import { useAppContext } from "../contexts/AppStateContext";
import calcXY from "../helpers/calcXY";
import useMetaGrid from "../hooks/components/metagrid/useMetaGrid";

const animDuration = 3;
const intro = "METAGRID";

const ANIM_DURATION = 0.3;

const MetaGrid = () => {
  const { cellSize, grid, cellCubes, exiting, display } =
    useMetaGrid(animDuration);
  const { metaGridLoaded, metagridBG } = useAppContext();

  return (
    <>
      {/* @ts-ignore */}
      <WindowContainer>
        <Canvas>
          <Environment
            background={true}
            files={[
              `images/skyboxes/${metagridBG}/leftImage.png`,
              `images/skyboxes/${metagridBG}/rightImage.png`,
              `images/skyboxes/${metagridBG}/upImage.png`,
              `images/skyboxes/${metagridBG}/downImage.png`,
              `images/skyboxes/${metagridBG}/frontImage.png`,
              `images/skyboxes/${metagridBG}/backImage.png`,
            ]}
          />

          <ambientLight intensity={0.5} />
          <FPV />
          <Physics>
            <Player xPos={cellSize * 1.5 * 5.5} zPos={cellSize * 1.5 * 5.5} />
            {grid.map((cell) => {
              const { x, y } = calcXY(cell + 1);
              const xOffset = cellSize * 1.5 * x;
              const zOffset = cellSize * 1.5 * y;

              return (
                <>
                  <Cubes cubes={cellCubes[cell] ?? []} />
                  <GridTile
                    cellSize={cellSize}
                    xOffset={xOffset}
                    zOffset={zOffset}
                    rowEnd={x === 10}
                    colEnd={y === 10}
                  />
                </>
              );
            })}
          </Physics>
        </Canvas>
        <MetaGridMenu />
        {metaGridLoaded && (
          <IntroContainer>
            <Center w="100%" h="100%">
              {intro.split("").map((char, index) => (
                <AnimatedSpan
                  fontFamily="Aquire"
                  opacity={0}
                  color="white"
                  fontSize="120px"
                  fontWeight="bold"
                  key={index}
                  //@ts-ignore
                  transition={{
                    delay:
                      animDuration +
                      ANIM_DURATION +
                      (index * ANIM_DURATION) / intro.length,
                    duration: ANIM_DURATION * 8,
                    ease: "easeIn",
                  }}
                  animate={{
                    opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                    y: [20, 0, 0, 0, 0, 0, 0, 0, 0, 20],
                  }}
                >
                  {char + " "}
                </AnimatedSpan>
              ))}
            </Center>
          </IntroContainer>
        )}

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
      </WindowContainer>
    </>
  );
};

const WindowContainer = chakra(Flex, {
  baseStyle: {
    h: "100vh",
    w: "100%",
  },
});

const IntroContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    w: "100%",
    h: "100vh",
    position: "absolute",
  },
});

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

export default MetaGrid;
