import { useEffect, useState } from "react";
import { NearestFilter, RepeatWrapping, Texture, TextureLoader } from "three";
import { Block, blockToImage } from "../../../constants/blocks";

/**
 * Hook used to separate the logic of the Marketplace Block Card from its JSX
 * @param block The type of block being displayed in the Marketplace Block Card
 */
const useMarketplaceBlockCard = (block: Block) => {
  const [mounted, setMounted] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [justRendered, setJustRendered] = useState(true);
  const [activeTexture, setActiveTexture] = useState<Texture | undefined>(
    undefined
  );

  const handleEnter = () => {
    setJustRendered(false);
    setHovering(true);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!typeof document === undefined) return;
    setActiveTexture(() => {
      let newTexture = new TextureLoader().load(
        `/images/${blockToImage[block]}`
      );
      newTexture.magFilter = NearestFilter;
      newTexture.wrapS = RepeatWrapping;
      newTexture.wrapT = RepeatWrapping;

      return newTexture;
    });
  }, []);

  return {
    handleEnter,
    setHovering,
    hovering,
    justRendered,
    mounted,
    activeTexture,
  };
};

export default useMarketplaceBlockCard;
