import { useBox } from "@react-three/cannon";
import { useState } from "react";
import { NearestFilter, RepeatWrapping, TextureLoader } from "three";
import { GameState, inputToImage } from "../../../constants/game";
import { useAppContext } from "../../../contexts/AppStateContext";

/**
 * 3D component that represents a Cube within gameplay
 * @param position Where the Cube is in the World
 * @param texture The texture of the Cube
 */
export const Cube = ({ position, texture }: any) => {
  const { gameState, handleAddCube, handleRemoveCube } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useBox(() => ({
    type: "Static",
    position,
  }));

  const [cubeTexture] = useState(() => {
    let newTexture = new TextureLoader().load(
      `/images/${inputToImage[texture]}`
    );
    newTexture.magFilter = NearestFilter;
    newTexture.wrapS = RepeatWrapping;
    newTexture.wrapT = RepeatWrapping;

    return newTexture;
  });

  const noInteraction =
    gameState === GameState.None || gameState === GameState.Visiting;

  return (
    <mesh
      onPointerMove={(e) => {
        if (noInteraction) return;
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        if (noInteraction) return;
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e: any) => {
        if (noInteraction) return;
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2);
        const { x, y, z } = ref.current!.position;
        if (e.altKey) {
          handleRemoveCube(x, y, z);
          return;
        } else if (clickedFace === 0) {
          handleAddCube(x + 1, y, z);
          return;
        } else if (clickedFace === 1) {
          handleAddCube(x - 1, y, z);
          return;
        } else if (clickedFace === 2) {
          handleAddCube(x, y + 1, z);
          return;
        } else if (clickedFace === 3) {
          handleAddCube(x, y - 1, z);
          return;
        } else if (clickedFace === 4) {
          handleAddCube(x, y, z + 1);
          return;
        } else if (clickedFace === 5) {
          handleAddCube(x, y, z - 1);
          return;
        }
      }}
      ref={ref as any}
    >
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? "dodgerblue" : "white"}
        map={cubeTexture}
        transparent={true}
        opacity={texture === "glass" ? 0.6 : 1}
        attach="material"
      />
    </mesh>
  );
};
