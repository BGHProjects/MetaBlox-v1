import { Canvas } from "@react-three/fiber";
import { range } from "lodash";
import { Suspense, useEffect, useState } from "react";
import MenuCube from "./MenuCube";
import Landscape from "./Landscape";
import Light from "./Light";

interface IMenuBackground {
  animationDelay: number;
}

const MenuBackground = ({ animationDelay }: IMenuBackground) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {!mounted ? null : (
        <Canvas
          camera={{ position: [0, 0.06, 1.1], fov: 75, near: 0.01, far: 20 }}
          style={{ width: "100%", height: "100vh" }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={["#000000"]} />
            <fog attach="fog" args={["#000000", 1, 2.5]} />
            {range(30).map((number) => (
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
