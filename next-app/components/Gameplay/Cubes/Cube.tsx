import { useBox } from "@react-three/cannon";
import { useState } from "react";
import { NearestFilter, RepeatWrapping, TextureLoader } from "three";
import { inputToImage } from "../../../constants/game";
import useStore from "../../../hooks/useStore";

/**
 * 3D component that represents a Cube within gameplay
 * @param position Where the Cube is in the World
 * @param texture The texture of the Cube
 */
export const Cube = ({ position, texture }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useBox(() => ({
    type: "Static",
    position,
  }));
  const [addCube, removeCube] = useStore((state: any) => [
    state.addCube,
    state.removeCube,
  ]);

  const [activeTexture, setActiveTexture] = useState(() => {
    let newTexture = new TextureLoader().load(
      `images/${inputToImage[texture]}`
    );
    newTexture.magFilter = NearestFilter;
    newTexture.wrapS = RepeatWrapping;
    newTexture.wrapT = RepeatWrapping;

    return newTexture;
  });

  return (
    <mesh
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e: any) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex / 2);
        const { x, y, z } = ref.current.position;
        if (e.altKey) {
          removeCube(x, y, z);
          return;
        } else if (clickedFace === 0) {
          addCube(x + 1, y, z);
          return;
        } else if (clickedFace === 1) {
          addCube(x - 1, y, z);
          return;
        } else if (clickedFace === 2) {
          addCube(x, y + 1, z);
          return;
        } else if (clickedFace === 3) {
          addCube(x, y - 1, z);
          return;
        } else if (clickedFace === 4) {
          addCube(x, y, z + 1);
          return;
        } else if (clickedFace === 5) {
          addCube(x, y, z - 1);
          return;
        }
      }}
      ref={ref}
    >
      <boxBufferGeometry attach="geometry" />
      <meshStandardMaterial
        color={isHovered ? "dodgerblue" : "white"}
        map={activeTexture}
        transparent={true}
        opacity={texture === "glass" ? 0.6 : 1}
        attach="material"
      />
    </mesh>
  );
};
