import { Center, chakra, Flex } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimatedDiv } from "../components/AnimatedComponents";
import { FPV, Ground, Player } from "../components/Gameplay";
import Cubes from "../components/Gameplay/Cubes/Cubes";
import ControlsCard from "../components/Gameplay/UI/ControlsCard";
import QuitCard from "../components/Gameplay/UI/QuitCard";
import TextureSelector from "../components/Gameplay/UI/TextureSelector";
import { useAppContext } from "../contexts/AppStateContext";
import useGame from "../hooks/components/useGame";
import useStore from "../hooks/useStore";

const cursorSize = 15;
const animDuration = 3;

/**
 * This page represents where the building gameplay acutally occurs,
 * and includes the 2D menu UI, as well as the ThreeJS building environment
 * @returns The UI component for page of the app where the gameplay occurs
 */
const Gameplay = () => {
  const [cubes] = useStore((state: any) => [state.cubes]);
  const { values, functions } = useGame(animDuration);
  const { showingSomething, display, exiting } = values;
  const { setShowingSomething, quitFunction, quitWithSave } = functions;
  const { sandboxBG, gameWorldLoaded } = useAppContext();

  return (
    <>
      {/* @ts-ignore */}
      <WindowContainer>
        <Canvas>
          <Environment
            background={true}
            files={[
              `/images/skyboxes/clouds/${sandboxBG}/leftImage.png`,
              `/images/skyboxes/clouds/${sandboxBG}/rightImage.png`,
              `/images/skyboxes/clouds/${sandboxBG}/upImage.png`,
              `/images/skyboxes/clouds/${sandboxBG}/downImage.png`,
              `/images/skyboxes/clouds/${sandboxBG}/frontImage.png`,
              `/images/skyboxes/clouds/${sandboxBG}/backImage.png`,
            ]}
          />

          <ambientLight intensity={0.5} />
          <FPV />
          <Physics>
            <Player />
            <Cubes cubes={cubes} />
            <Ground />
          </Physics>
        </Canvas>
        <TextureSelector />
        <QuitCard
          showingSomething={showingSomething}
          setShowingSomething={setShowingSomething}
          quitFunction={quitFunction}
          quitWithSave={quitWithSave}
        />
        <ControlsCard
          showingSomething={showingSomething}
          setShowingSomething={setShowingSomething}
        />
        <FadeContainer
          zIndex="3"
          display={display}
          initial={{ opacity: 1 }}
          // @ts-ignore
          transition={{
            duration: animDuration,
            ease: "easeIn",
          }}
          animate={{ opacity: exiting ? [0, 1] : gameWorldLoaded ? [1, 0] : 1 }}
        />
        {!showingSomething && <Cursor />}
      </WindowContainer>
    </>
  );
};

const Cursor = chakra(Center, {
  baseStyle: {
    position: "absolute",
    bg: "white",
    h: `${cursorSize}px`,
    w: `${cursorSize}px`,
    left: "0",
    right: "0",
    top: "0",
    bottom: "0",
    m: "auto",
    borderRadius: "full",
    border: "1px solid black",
  },
});

const WindowContainer = chakra(Flex, {
  baseStyle: {
    h: "100vh",
    w: "100%",
  },
});

const FadeContainer = chakra(AnimatedDiv, {
  shouldForwardProp: () => true,
  baseStyle: {
    w: "100%",
    h: "100vh",
    bg: "black",
    position: "absolute",
  },
});

export default Gameplay;
