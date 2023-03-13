import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { gridBlue, gridPink } from "../../../constants/colours";
import useColourAnimation from "../../../hooks/useColorAnimation";

/**
 * Represents the lights that are shone down the chamber
 * in the Menu background
 */
const Light = () => {
  const [lightColor, setLightColour] = useState("");

  const color = useColourAnimation(gridBlue, gridPink);

  useEffect(() => {
    setLightColour(color);
  }, [color]);

  const positions = [
    [0.5, 0.75, 2.1],
    [-0.5, 0.75, 2.1],
    [0, -0.75, 3],
    [0, -0.75, 3],
  ];

  return (
    <>
      {positions.map((position) => (
        <spotLight
          key={nanoid()}
          color={lightColor}
          intensity={40}
          position={position as any}
          distance={25}
          angle={Math.PI * 0.1}
          penumbra={0.25}
          decay={10}
        />
      ))}
    </>
  );
};

export default Light;
