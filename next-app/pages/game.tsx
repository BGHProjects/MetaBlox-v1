import { Center, chakra, Flex } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { FPV, Ground, Player } from "../components/Gameplay";
import Cubes from "../components/Gameplay/Cubes/Cubes";
import ControlsCard from "../components/Gameplay/UI/ControlsCard";
import QuitCard from "../components/Gameplay/UI/QuitCard";
import TextureSelector from "../components/Gameplay/UI/TextureSelector";

const cursorSize = 15;

const Gameplay = () => {
  const [showingSomething, setShowingSomething] = useState(false);

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
        <QuitCard setShowingSomething={setShowingSomething} />
        <ControlsCard setShowingSomething={setShowingSomething} />
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

export default Gameplay;
