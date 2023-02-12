import { memo } from "react";
import { Status } from "../../../constants/worldTokens";
import useGridParcel from "../../../hooks/components/grid/useGridParcel";
import { AnimatedDiv } from "../../AnimatedComponents";
import AppModal from "../../AppModal";
import GridModalContent from "./GridModalContent";

interface IGridParcel {
  idx: number;
  gridSize: number;
}

/**
 * Represents an individual parcel on the Grid, which itself is a World within the game
 * @param idx The index of the parcel on the grid
 * @param gridSize The overall size of the grid
 * @returns The UI component for an individual Grid Parcel
 */
const GridParcel = ({ idx, gridSize }: IGridParcel) => {
  const {
    handleEnter,
    handleClick,
    hovering,
    justRendered,
    openModal,
    setOpenModal,
    setHovering,
    colour,
    status,
    coords,
  } = useGridParcel(idx + 1);

  return (
    <>
      <AnimatedDiv
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovering(false)}
        onClick={handleClick}
        bg={colour}
        flex={gridSize}
        cursor="pointer"
        border="0.5px solid white"
        animate={{
          scale: hovering ? [1, 1.6] : justRendered ? 1 : [1.6, 1],
          borderRadius: hovering
            ? ["0px", `${gridSize / 10}px`]
            : justRendered
            ? "0px"
            : [`${gridSize / 10}px`, "0px"],
          borderWidth: hovering ? 2 : 0.5,
        }}
        // @ts-ignore
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      />
      <AppModal
        closeFunction={() => setOpenModal(false)}
        isOpen={openModal}
        title={""}
        content={
          <GridModalContent
            x={coords.x}
            y={coords.y}
            status={status}
            colour={colour}
          />
        }
      />
    </>
  );
};

export default memo(GridParcel);
