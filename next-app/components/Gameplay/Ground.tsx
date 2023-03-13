import { usePlane } from "@react-three/cannon";
import { useState } from "react";
import { NearestFilter, RepeatWrapping, TextureLoader } from "three";
import { GameState } from "../../constants/game";
import { useAppContext } from "../../contexts/AppStateContext";

const Ground = () => {
  const { gameState, handleAddCube } = useAppContext();
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  const [groundTexture] = useState(() => {
    let newGroundTexture = new TextureLoader().load("/images/sandbox-cell.png");
    newGroundTexture.magFilter = NearestFilter;
    newGroundTexture.wrapS = RepeatWrapping;
    newGroundTexture.wrapT = RepeatWrapping;

    newGroundTexture.repeat.set(100, 100);
    return newGroundTexture;
  });

  return (
    <mesh
      onClick={(e) => {
        if (gameState === GameState.None || gameState === GameState.Visiting)
          return;

        e.stopPropagation();
        const [x, y, z] = Object.values(e.point).map((val) => Math.ceil(val));
        handleAddCube(x, y, z);
      }}
      ref={ref as any}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={groundTexture} />
    </mesh>
  );
};

export default Ground;
