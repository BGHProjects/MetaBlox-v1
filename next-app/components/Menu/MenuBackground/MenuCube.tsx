import { useEffect, useRef, useState } from "react";
import {
  Mesh,
  NearestFilter,
  RepeatWrapping,
  Texture,
  TextureLoader,
} from "three";
import getRandomNumber from "../../../helpers/getRandomNumber";

const OFF_SCREEN_LIMIT = 2;
const CUBE_SIZE = 0.03;

interface IMenuCube {
  animationDelay: number;
}

const MenuCube = ({ animationDelay }: IMenuCube) => {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [position, setPosition] = useState({
    x: 0,
    y: 0.1,
    z: -2,
  });
  const [activeTexture, setActiveTexture] = useState<Texture | undefined>(
    undefined
  );
  const flowSpeed = 0.01;
  const randomSpin = getRandomNumber(-30, 30) / 1000;
  let ySpin = randomSpin;
  let zSpin = randomSpin;
  const flowDelay = animationDelay * 1000 + getRandomNumber(10, 1000) * 10;
  let xPos = getRandomNumber(30, 70) / 1000;
  let yPos = getRandomNumber(30, 150) / 1000;

  const cubeRef = useRef<Mesh>();

  const randomTexture: Record<number, string> = {
    [1]: "wood.png",
    [2]: "glass.png",
    [3]: "grass.jpg",
    [4]: "log.jpg",
    [5]: "dirt.jpg",
    [6]: "gold.png",
    [7]: "opal.png",
    [8]: "lava.jpg",
    [9]: "space.png",
    [10]: "amethyst.png",
  };

  const randomColor: Record<number, string> = {
    [1]: "red",
    [2]: "orange",
    [3]: "dodgerblue",
    [4]: "limegreen",
    [5]: "purple",
    [6]: "gold",
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!typeof document === undefined) return;

    const randomImage = randomTexture[getRandomNumber(1, 10)];
    let newTexture = new TextureLoader().load(`/images/${randomImage}`);
    newTexture.magFilter = NearestFilter;
    newTexture.wrapS = RepeatWrapping;
    newTexture.wrapT = RepeatWrapping;
    setActiveTexture(newTexture);
  }, []);

  useEffect(() => {
    if (!cubeRef.current) return;
    cubeRef.current!.rotation.set(rotation.x, rotation.y, rotation.z);
    cubeRef.current!.position.set(position.x, position.y, position.z);
  }, [cubeRef.current, rotation, position]);

  useEffect(() => {
    let coinFlip1 = getRandomNumber(1, 2);
    let coinFlip2 = getRandomNumber(1, 2);

    if (coinFlip1 === 1) xPos *= -1;
    if (coinFlip2 === 2) yPos *= -1;

    setPosition({ x: xPos, y: yPos, z: -2 });

    setTimeout(() => {
      const interval = setInterval(() => {
        setRotation((prevRotation) => ({
          x: prevRotation.x,
          y: prevRotation.y + ySpin,
          z: prevRotation.z + zSpin,
        }));

        setPosition((prevPosition) => ({
          x: xPos,
          y: yPos,
          z:
            prevPosition.z >= OFF_SCREEN_LIMIT + 0.5
              ? (prevPosition.z = -OFF_SCREEN_LIMIT)
              : (prevPosition.z += flowSpeed),
        }));
      }, 1000 / 60);
      return () => clearInterval(interval);
    }, flowDelay);
  }, []);

  if (!mounted) return null;

  return (
    <mesh ref={cubeRef as any}>
      <boxGeometry attach="geometry" args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <meshBasicMaterial
        attach="material"
        map={activeTexture}
        color={!activeTexture ? randomColor[getRandomNumber(1, 6)] : undefined}
      />
    </mesh>
  );
};

export default MenuCube;
