import { chakra, Flex } from "@chakra-ui/react";
import { Canvas } from "@react-three/fiber";
import MenuCube from "./MenuCube";

const MenuBackground = () => {
  return (
    <>
      {/* @ts-ignore */}
      <WindowContainer>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 75 }}
          style={{
            backgroundImage: "url(/images/neon_grid_background.jpg)",
            backgroundSize: "cover",
          }}
        >
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
          <MenuCube />
        </Canvas>
      </WindowContainer>
    </>
  );
};

const WindowContainer = chakra(Flex, {
  baseStyle: {
    h: "100vh",
    w: "100%",
    position: "absolute",
  },
});

export default MenuBackground;
