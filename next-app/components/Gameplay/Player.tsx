import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { MutableRefObject, useEffect, useRef } from "react";
import { Vector3 } from "three";
import useKeyboard from "../../hooks/useKeyboard";
import { useAppContext } from "../../contexts/AppStateContext";
import { useRouter } from "next/router";

const JUMP_FORCE = 4;
const SPEED = 4;

interface IPlayer {
  xPos?: number;
  yPos?: number;
  zPos?: number;
  pos?: MutableRefObject<number[]>;
}

/**
 * Represents the player within the game
 */
const Player = ({
  xPos = 0,
  yPos = 1,
  zPos = 0,
  pos = useRef([0, 0, 0]),
}: IPlayer) => {
  const router = useRouter();
  const pathName = router.pathname;
  const {
    metaGridLoaded,
    setMetaGridLoaded,
    gameWorldLoaded,
    setGameWorldLoaded,
  } = useAppContext();
  const { moveBackward, moveForward, moveRight, moveLeft, jump, sprint } =
    useKeyboard();

  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [xPos, yPos, zPos],
  }));

  const vel = useRef([0, 0, 0]);
  useEffect(() => {
    api.velocity.subscribe((v) => (vel.current = v));
  }, [api.velocity]);

  useEffect(() => {
    api.position.subscribe((p) => (pos.current = p));
  }, [api.position]);

  useFrame(() => {
    camera.position.copy(
      new Vector3(pos.current[0], pos.current[1], pos.current[2])
    );

    const direction = new Vector3();

    const frontVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    );

    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED * (sprint ? 10 : 1))
      .applyEuler(camera.rotation);

    api.velocity.set(direction.x, vel.current[1], direction.z);

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
    }

    if (Number(pos.current[1].toFixed(1)) === 0.5) {
      if (!metaGridLoaded && pathName === "/metagrid") {
        setMetaGridLoaded(true);
      }

      if (!gameWorldLoaded && pathName === "/game") {
        setGameWorldLoaded(true);
      }
    }
  });

  return <mesh ref={ref as any} />;
};

export default Player;
