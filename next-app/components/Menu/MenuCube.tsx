import { useEffect, useRef, useState } from "react";
import { NearestFilter, RepeatWrapping, Texture, TextureLoader } from "three";
import getRandomNumber from "../../helpers/getRandomNumber";

const OFF_SCREEN_LIMIT = 6;

const MenuCube = () => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [position, setPosition] = useState({
    x: getRandomNumber(-5, 5),
    y: -6,
    z: 0,
  });
  const [activeTexture, setActiveTexture] = useState<Texture | undefined>(
    undefined
  );
  const flowSpeed = getRandomNumber(5, 20) / 1000;
  const ySpin = getRandomNumber(-30, 30) / 1000;
  const zSpin = getRandomNumber(-30, 30) / 1000;
  const flowDelay = getRandomNumber(10, 1000) * 10;

  const cubeRef = useRef();

  const randomTexture: Record<number, string> = {
    [1]: "wood.png",
    [2]: "glass.png",
    [3]: "grass.jpg",
    [4]: "log.jpg",
    [5]: "dirt.jpg",
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
    if (!typeof document === undefined) return;
    setActiveTexture(() => {
      let newTexture = new TextureLoader().load(
        `images/${randomTexture[getRandomNumber(1, 5)]}`
      );
      newTexture.magFilter = NearestFilter;
      newTexture.wrapS = RepeatWrapping;
      newTexture.wrapT = RepeatWrapping;

      return newTexture;
    });
  }, []);

  useEffect(() => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
    cubeRef.current.position.set(position.x, position.y, position.z);
  }, [cubeRef.current, rotation, position]);

  useEffect(() => {
    setTimeout(() => {
      const interval = setInterval(() => {
        setRotation((prevRotation) => ({
          x: prevRotation.x,
          y: prevRotation.y + ySpin,
          z: prevRotation.z + zSpin,
        }));

        setPosition((prevPosition) => ({
          x: prevPosition.x,
          y:
            prevPosition.y >= OFF_SCREEN_LIMIT
              ? (prevPosition.y = -OFF_SCREEN_LIMIT)
              : prevPosition.y + flowSpeed,
          z: prevPosition.z,
        }));
      }, 1000 / 60);
      return () => clearInterval(interval);
    }, flowDelay);
  }, []);

  return (
    <mesh ref={cubeRef}>
      <boxGeometry attach="geometry" />
      <meshBasicMaterial
        attach="material"
        map={activeTexture}
        color={activeTexture ?? randomColor[getRandomNumber(1, 6)]}
      />
    </mesh>
  );
};

export default MenuCube;
