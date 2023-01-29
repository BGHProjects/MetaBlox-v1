import { Center, chakra, Flex, Box } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AnimatedDiv } from "../components/AnimatedComponents";
import { FPV, Ground, Player } from "../components/Gameplay";
import Cubes from "../components/Gameplay/Cubes/Cubes";
import ControlsCard from "../components/Gameplay/UI/ControlsCard";
import QuitCard from "../components/Gameplay/UI/QuitCard";
import TextureSelector from "../components/Gameplay/UI/TextureSelector";
import { useAppContext } from "../contexts/AppStateContext";

const cursorSize = 15;
const animDuration = 3;

/**
 * This page represents where the building gameplay acutally occurs,
 * and includes the 2D menu UI, as well as the ThreeJS building environment
 * @returns The UI component for page of the app where the gameplay occurs
 */
const Gameplay = () => {
  const [showingSomething, setShowingSomething] = useState(false);
  const [display, setDisplay] = useState("flex");
  const [exiting, setExiting] = useState(false);
  const router = useRouter();
  const { setStartingGameplay } = useAppContext();

  useEffect(() => {
    setStartingGameplay(false);
    setTimeout(() => {
      setDisplay("none");
    }, animDuration * 1000);
  }, []);

  const quitFunction = () => {
    setDisplay("flex");
    setExiting(true);
    setTimeout(() => {
      router.push("/");
    }, (animDuration + 1) * 1000);
  };

  return (
    <>
      {/* @ts-ignore */}
      <WindowContainer>
        <Canvas>
          <Sky sunPosition={[100, 100, 20]} />
          <ambientLight intensity={0.5} />
          <FPV />
          <Physics>
            <Player />
            <Cubes />
            <Ground />
          </Physics>
        </Canvas>
        <TextureSelector />
        <QuitCard
          setShowingSomething={setShowingSomething}
          quitFunction={quitFunction}
        />
        <ControlsCard setShowingSomething={setShowingSomething} />
        <FadeContainer
          zIndex="3"
          display={display}
          initial={{ opacity: 1 }}
          //@ts-ignore
          transition={{
            duration: animDuration,
            ease: "easeIn",
          }}
          animate={{ opacity: exiting ? [0, 1] : [1, 0] }}
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
