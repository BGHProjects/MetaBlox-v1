import { Canvas } from "@react-three/fiber";
import { range } from "lodash";
import { Suspense, useEffect, useState } from "react";
import Landscape from "./Landscape";
import Light from "./Light";
import MenuCube from "./MenuCube";

interface IMenuBackground {
  animationDelay: number;
}

/**
 * The 3D component that rendered behind the UI in the main menu
 * @param animatedDelay The delay before any animations begin
 */
const MenuBackground = ({ animationDelay }: IMenuBackground) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {!mounted ? null : (
        <Canvas
          camera={{
            position: [0, 0.08, 0.8],
            fov: 75,
            near: 0.01,
            far: 20,
          }}
          style={{ width: "100%", height: "100vh" }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 1, 2.5]} />
            {range(100).map((number) => (
              <MenuCube key={number} animationDelay={animationDelay} />
            ))}
            <Light />
            <Landscape />
          </Suspense>
        </Canvas>
      )}
    </>
  );
};

export default MenuBackground;
