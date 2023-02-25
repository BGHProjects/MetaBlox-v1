import { useState } from "react";
import { NearestFilter, RepeatWrapping, TextureLoader } from "three";

const useLoadTexture = (image: string, xSize: number, zSize: number) => {
  const [texture] = useState(() => {
    let newGroundTexture = new TextureLoader().load(image);
    newGroundTexture.magFilter = NearestFilter;
    newGroundTexture.wrapS = RepeatWrapping;
    newGroundTexture.wrapT = RepeatWrapping;

    newGroundTexture.repeat.set(xSize, zSize);
    return newGroundTexture;
  });

  return texture;
};

export default useLoadTexture;
