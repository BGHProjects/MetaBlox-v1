import { useEffect, useRef, useState } from "react";
import { Mesh } from "three";
import getRandomNumber from "../../../helpers/getRandomNumber";

/**
 * Hook used to separate the logic of the Marketplace Block Preview from its JSX
 */
const useMarketplaceBlockPreview = () => {
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

  return { cubeRef };
};

export default useMarketplaceBlockPreview;
