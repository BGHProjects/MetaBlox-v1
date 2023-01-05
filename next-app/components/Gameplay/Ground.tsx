import { usePlane } from "@react-three/cannon";
import { useState } from "react";
import { NearestFilter, TextureLoader, RepeatWrapping } from "three";

import useStore from "../../hooks/useStore";

const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));
  const [addCube] = useStore((state) => [state.addCube]);

  const [groundTexture, setGroundTexture] = useState((old) => {
    let newGroundTexture = new TextureLoader().load("images/grass.jpg");
    newGroundTexture.magFilter = NearestFilter;
    newGroundTexture.wrapS = RepeatWrapping;
    newGroundTexture.wrapT = RepeatWrapping;

    newGroundTexture.repeat.set(100, 100);
    return newGroundTexture;
  });

  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        const [x, y, z] = Object.values(e.point).map((val) => Math.ceil(val));
        addCube(x, y, z);
      }}
      ref={ref}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </mesh>
  );
};

export default Ground;