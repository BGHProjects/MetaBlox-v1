import { useTexture } from "@react-three/drei";
import { forwardRef, useRef } from "react";
import { MeshStandardMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";

const fragmentShader = `
float aastep(in float threshold, in float value) {
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return 1.0 - smoothstep(threshold-afwidth, threshold+afwidth, value);
}

void main() {
  float lw = 1.0;
  float w;

  float gx = 1.0 + cos(vUv.x * 24.0 * 2.0 * PI - PI);
  w = fwidth(vUv.x) * lw;
  gx = aastep(w, gx);

  float gy = 1.0 + cos(vUv.y * 24.0 * 2.0 * PI - PI);
  w = fwidth(vUv.y) * lw;
  gy = aastep(w, gy);

  float grid = gx + gy;
  
  csm_DiffuseColor = vec4(grid, grid * 0.3, grid * 0.5, 1.0);
}
`;

const Terrain = forwardRef(
  (props: { z: number; posY: number; rotY: number; posX: number }, ref) => {
    const { z, posY, rotY, posX } = props;
    const materialRef = useRef();

    const [heightTexture, metalnessTexture] = useTexture([
      "/images/displacement.png",
      "/images/metalness.png",
    ]);

    return (
      <mesh
        ref={ref as any}
        position={[posX, posY, z]}
        rotation={[-Math.PI * 0.5, rotY, 0]}
      >
        <planeBufferGeometry attach="geometry" args={[1, 2, 24, 24]} />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={MeshStandardMaterial}
          fragmentShader={fragmentShader}
          displacementMap={heightTexture}
          displacementScale={0}
          metalnessMap={metalnessTexture}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
    );
  }
);

Terrain.displayName = "Terrain";

export default Terrain;
