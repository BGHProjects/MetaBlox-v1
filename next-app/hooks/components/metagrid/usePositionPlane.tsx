import { usePlane } from "@react-three/cannon";

const usePositionPlane = ({
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  posX = 0,
  posY = 0,
  posZ = 0,
}: {
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  posX?: number;
  posY?: number;
  posZ?: number;
}) => {
  const [ref] = usePlane(() => ({
    rotation: [rotX, rotY, rotZ],
    position: [posX, posY, posZ],
  }));

  return ref;
};

export default usePositionPlane;
