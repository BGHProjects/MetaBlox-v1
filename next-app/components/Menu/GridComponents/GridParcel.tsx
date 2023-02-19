import { Flex } from "@chakra-ui/react";
import { memo, useState } from "react";
import { Status } from "../../../constants/worldTokens";
import AppModal from "../../AppModal";
import GridModalContent from "./GridModalContent";

interface IGridParcel {
  x: number;
  y: number;
  gridSize: number;
  status: Status;
  colour: string;
  worldId: number | undefined;
}

/**
 * Represents an individual parcel on the Grid, which itself is a World within the game
 * @param x The x coordinate of the parcel on the grid
 * @param y The y coordinate of the parcel on the grid
 * @param gridSize The overall size of the grid
 * @param status The status of the parcel on the grid
 * @param colour The colour of the parcel on the grid
 * @param worldId The id of the World Token that this parcel associates with
 * @returns The UI component for an individual Grid Parcel
 */
const GridParcel = ({
  gridSize,
  x,
  y,
  status,
  colour,
  worldId,
}: IGridParcel) => {
  const [openModal, setOpenModal] = useState(false);

  const handleClick = () => {
    setOpenModal(true);
  };

  return (
    <>
      <Flex
        onClick={handleClick}
        bg={colour}
        flex={gridSize}
        cursor="pointer"
        border="0.5px solid white"
      />
      <AppModal
        closeFunction={() => setOpenModal(false)}
        isOpen={openModal}
        title={""}
        content={
          <GridModalContent
            x={x}
            y={y}
            status={status}
            colour={colour}
            closeFunction={() => setOpenModal(false)}
            worldId={worldId}
          />
        }
      />
    </>
  );
};

export default memo(GridParcel);
