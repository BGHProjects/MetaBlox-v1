import { Center, SimpleGrid } from "@chakra-ui/react";
import { memo, useEffect } from "react";
import useCheckGrid from "../../../hooks/context/useCheckGrid";
import GridParcel from "../GridComponents/GridParcel";

const GRID_SIZE = 375;
const test = Array.from(Array(100).keys());

/**
 * Represents the Grid Menu option, including the Grid of World parcels
 * that the player can view
 * @returns The UI component for the Grid Menu Option
 */
const Grid = () => {
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
        {test.map((item: number) => (
          <GridParcel key={item} idx={item} gridSize={GRID_SIZE} />
        ))}
      </SimpleGrid>
    </Center>
  );
};

export default memo(Grid);
