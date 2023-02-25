import { ICube } from "../../../interfaces/cube";
import { Cube } from "./Cube";

interface ICubes {
  cubes: ICube[];
}

/**
 * Represents the all the Cubes currently being rendered in gameplay
 */
const Cubes = ({ cubes }: ICubes): any => {
  return cubes.map(({ key, pos, texture }: ICube) => {
    return <Cube key={key} position={pos} texture={texture} />;
  });
};

export default Cubes;
