import { Flex } from "@chakra-ui/react";
import { ethers } from "ethers";
import { range } from "lodash";
import { nanoid } from "nanoid";
import { memo, useMemo } from "react";
import { useAppContext } from "../../contexts/AppStateContext";
import calcXY from "../../helpers/calcXY";
import mapValue from "../../helpers/mapValue";

const MapCells = () => {
  const { gridData } = useAppContext();

  const getWorldColour = useMemo(() => {
    return (x: number, y: number) => {
      const thisWorld = gridData.find(
        (gridItem) =>
          Number(ethers.utils.formatUnits(gridItem.x, "wei")) === x &&
          Number(ethers.utils.formatUnits(gridItem.y, "wei")) === y
      );

      if (!thisWorld) return "black";
      return thisWorld.colour;
    };
  }, [gridData]);

  return (
    <>
      {useMemo(() => {
        return range(100).map((cell) => {
          const { x, y } = calcXY(cell + 1);
          const xCoord = mapValue(100 + (x - 1) * 150);
          const yCoord = mapValue(100 + (y - 1) * 150);
          const colour = getWorldColour(x, y);

          return (
            <Flex
              key={nanoid()}
              bg={colour}
              position="absolute"
              boxSize="20px"
              left={`calc(${xCoord}% - 5px)`}
              top={`calc(${yCoord}% - 5px)`}
              cursor="pointer"
            />
          );
        });
      }, [])}
    </>
  );
};

export default memo(MapCells);
