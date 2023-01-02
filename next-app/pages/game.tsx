import { Flex, chakra, Text, Center } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { FPV, Ground, Player } from "../components/Gameplay";
import Cubes from "../components/Gameplay/Cubes/Cubes";
import TextureSelector from "../components/Gameplay/TextureSelector";

const Gameplay = () => {
  return (
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
      <CursorContainer>
        <Cursor>+</Cursor>
      </CursorContainer>
    </WindowContainer>
  );
};

const CursorContainer = chakra(Center, {
  baseStyle: {
    position: "absolute",
    w: "100%",
    h: "100vh",
  },
});

const Cursor = chakra(Text, {
  fontSize: "30px",
  fontWeight: "bold",
  color: "red",
});

const WindowContainer = chakra(Flex, {
  baseStyle: {
    h: "100vh",
    w: "100%",
  },
});

export default Gameplay;
