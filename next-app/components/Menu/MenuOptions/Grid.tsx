import { Center, SimpleGrid } from "@chakra-ui/react";
import { ethers } from "ethers";
import { memo, useMemo } from "react";
import { Status } from "../../../constants/worldTokens";
import { useAppContext } from "../../../contexts/AppStateContext";
import useCheckGrid from "../../../hooks/context/useCheckGrid";
import GridParcel from "../GridComponents/GridParcel";

const GRID_SIZE = 375;
const test = Array.from(Array(100).keys());

const calcXY = (idx: number) => {
  let x = idx % 10 === 0 ? 10 : idx % 10;
  let y = Math.ceil(idx / 10);
  return { x, y };
};

/**
 * Represents the Grid Menu option, including the Grid of World parcels
 * that the player can view
 * @returns The UI component for the Grid Menu Option
 */
const Grid = () => {
  const { gridData } = useCheckGrid();
  const { playerColour } = useAppContext();

  const determineAttributes = useMemo(() => {
    return (x: number, y: number) => {
      const thisWorld = gridData.find(
        (gridItem) =>
          Number(ethers.utils.formatUnits(gridItem.x, "wei")) === x &&
          Number(ethers.utils.formatUnits(gridItem.y, "wei")) === y
      );

      if (!thisWorld) return { colour: "black", status: Status.Vacant };

      const colour = thisWorld.colour;
      let status;

      if (playerColour === thisWorld.colour) {
        status = Status.Owned;
      } else {
        status = Status.Unavailable;
      }

      return { colour, status };
    };
  }, [gridData, playerColour]);

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
        {test.map((item: number) => {
          const { x, y } = calcXY(item + 1);

          const { status, colour } = determineAttributes(x, y);

          return (
            <GridParcel
              key={item}
              x={x}
              y={y}
              gridSize={GRID_SIZE}
              status={status}
              colour={colour}
            />
          );
        })}
      </SimpleGrid>
    </Center>
  );
};

export default memo(Grid);
