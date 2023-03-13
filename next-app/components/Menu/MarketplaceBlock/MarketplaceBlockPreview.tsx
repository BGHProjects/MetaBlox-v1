import { Canvas } from "@react-three/fiber";
import { Texture } from "three";
import { Block } from "../../../constants/blocks";
import useMarketplaceBlockPreview from "../../../hooks/components/marketplace/useMarketplaceBlockPreview";

interface IMarketplaceBlockPreview {
  activeTexture: Texture | undefined;
  block: Block;
}

/**
 * The spinning preview of the block that is displayed in the MarketplaceBlockCard
 * @param activeTexture The texture displayed on the block
 * @param block The type of block that is to be displayed
 */
const MarketplaceBlockPreview = ({
  activeTexture,
  block,
}: IMarketplaceBlockPreview) => {
  const { cubeRef } = useMarketplaceBlockPreview();

  return (
    <Canvas style={{ width: "95%", height: "95%" }}>
      <color attach="background" args={["#000"]} />
      <mesh ref={cubeRef as any}>
        <boxGeometry attach="geometry" args={[3, 3, 3]} />
        <meshBasicMaterial
          attach="material"
          map={activeTexture}
          transparent={true}
          opacity={block === Block.Glass ? 0.6 : 1}
        />
      </mesh>
    </Canvas>
  );
};

export default MarketplaceBlockPreview;
