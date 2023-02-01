import useStore from "../../../hooks/useStore";
import { ICube } from "../../../interfaces/cube";
import { Cube } from "./Cube";

/**
 * Represents the all the Cubes currently being rendered in gameplay
 */
const Cubes = () => {
  const [cubes] = useStore((state) => [state.cubes]);
  return cubes.map(({ key, pos, texture }: ICube) => {
    return <Cube key={key} position={pos} texture={texture} />;
  });
};

export default Cubes;
