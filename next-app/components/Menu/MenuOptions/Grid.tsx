import { Center, SimpleGrid } from "@chakra-ui/react";
import { range } from "lodash";
import { Status } from "../../../constants/worldTokens";
import getRandomNumber from "../../../helpers/getRandomNumber";
import GridParcel from "../GridComponents/GridParcel";

const GRID_SIZE = 375;

/**
 * Represents the Grid Menu option, including the Grid of World parcels
 * that the player can view
 * @returns The UI component for the Grid Menu Option
 */
const Grid = () => {
  const test = range(100);

  const generateRandomColour = () => {
    return `rgb(${getRandomNumber(0, 255)}, ${getRandomNumber(
      0,
      255
    )}, ${getRandomNumber(0, 255)})`;
  };

  return (
    <Center w="100%" h="100%" mt="-20px">
      <SimpleGrid
        w={`${GRID_SIZE}px`}
        h={`${GRID_SIZE}px`}
        spacingX={0}
        spacingY={0}
        columns={10}
        p={0}
        border="0.75 solid white"
      >
        {test.map((item) => (
          <GridParcel
            key={item}
            idx={item}
            colour={generateRandomColour()}
            gridSize={GRID_SIZE}
            status={Status.Unavailable}
          />
        ))}
      </SimpleGrid>
    </Center>
  );
};

export default Grid;
