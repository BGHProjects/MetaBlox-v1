import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { Mesh, Texture } from "three";
import { Block } from "../../../constants/blocks";
import getRandomNumber from "../../../helpers/getRandomNumber";

interface IMarketplaceBlockPreview {
  activeTexture: Texture | undefined;
  block: Block;
}

/**
 * The spinning preview of the block that is displayed in the MarketplaceBlockCard
 * @param activeTexture The texture displayed on the block
 * @param block The type of block that is to be displayed
 */
const MarketplaceBlockPreview = ({
  activeTexture,
  block,
}: IMarketplaceBlockPreview) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const randomSpin = getRandomNumber(3, 5) / 1000;
  let ySpin = randomSpin;
  let zSpin = randomSpin;

  const cubeRef = useRef<Mesh>();

  useEffect(() => {
    let coinFlip1 = getRandomNumber(1, 2);
    let coinFlip2 = getRandomNumber(1, 2);

    if (coinFlip1 === 1) ySpin *= -1;
    if (coinFlip2 === 2) zSpin *= -1;

    setTimeout(() => {
      const interval = setInterval(() => {
        setRotation((prevRotation) => ({
          x: prevRotation.x,
          y: prevRotation.y + ySpin,
          z: prevRotation.z + zSpin,
        }));
      }, 1000 / 60);
      return () => clearInterval(interval);
    }, 100);
  }, []);

  useEffect(() => {
    if (!cubeRef.current) return;
    cubeRef.current!.rotation.set(rotation.x, rotation.y, rotation.z);
  }, [cubeRef.current, rotation]);

  return (
    <Canvas style={{ width: "95%", height: "95%" }}>
      <color attach="background" args={["#000"]} />
      <mesh ref={cubeRef}>
        <boxGeometry attach="geometry" args={[3, 3, 3]} />
        <meshBasicMaterial
          attach="material"
          map={activeTexture}
          transparent={true}
          opacity={block === Block.Glass ? 0.6 : 1}
        />
      </mesh>
    </Canvas>
  );
};

export default MarketplaceBlockPreview;
