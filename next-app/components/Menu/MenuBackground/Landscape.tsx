import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh } from "three";
import Terrain from "./Terrain";

const SPEED = 0.1;

/**
 * Represents the geometric grid chamber that the camera
 * "passes through" in the Menu screen
 */
const Landscape = () => {
  const terrain1Ref = useRef<Mesh>();
  const terrain2Ref = useRef<Mesh>();
  const terrain3Ref = useRef<Mesh>();
  const terrain4Ref = useRef<Mesh>();
  const terrain5Ref = useRef<Mesh>();
  const terrain6Ref = useRef<Mesh>();
  const terrain7Ref = useRef<Mesh>();
  const terrain8Ref = useRef<Mesh>();

  useFrame((state) => {
    const baseChange = (state.clock.elapsedTime * SPEED) % 2;

    terrain1Ref.current!.position.z = baseChange;
    terrain2Ref.current!.position.z = baseChange - 2;
    terrain3Ref.current!.position.z = baseChange;
    terrain4Ref.current!.position.z = baseChange - 2;
    terrain5Ref.current!.position.z = baseChange;
    terrain6Ref.current!.position.z = baseChange - 2;
    terrain7Ref.current!.position.z = baseChange;
    terrain8Ref.current!.position.z = baseChange - 2;
  });

  return (
    <>
      <Terrain ref={terrain1Ref} z={0} posY={0} rotY={0} posX={0} />
      <Terrain ref={terrain2Ref} z={-2} posY={0} rotY={0} posX={0} />
      <Terrain ref={terrain3Ref} z={0} posY={0.2} rotY={Math.PI} posX={0} />
      <Terrain ref={terrain4Ref} z={-2} posY={0.2} rotY={Math.PI} posX={0} />
      <Terrain
        ref={terrain5Ref}
        z={0}
        posY={0.5}
        rotY={Math.PI * 1.5}
        posX={0.2}
      />
      <Terrain
        ref={terrain6Ref}
        z={-2}
        posY={0.5}
        rotY={Math.PI * 1.5}
        posX={0.2}
      />
      <Terrain
        ref={terrain7Ref}
        z={0}
        posY={0.5}
        rotY={Math.PI / 2}
        posX={-0.2}
      />
      <Terrain
        ref={terrain8Ref}
        z={-2}
        posY={0.5}
        rotY={Math.PI / 2}
        posX={-0.2}
      />
    </>
  );
};

export default Landscape;
