import { useState } from "react";
import { Status } from "../../../constants/worldTokens";
import getRandomNumber from "../../../helpers/getRandomNumber";
import { AnimatedDiv } from "../../AnimatedComponents";
import AppModal from "../../AppModal";
import GridModalContent from "./GridModalContent";

interface IGridParcel {
  idx: number;
  gridSize: number;
  colour: string;
  status: Status;
}

const GridParcel = ({ idx, gridSize, colour, status }: IGridParcel) => {
  const [hovering, setHovering] = useState(false);
  const [justRendered, setJustRendered] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleEnter = () => {
    setJustRendered(false);
    setHovering(true);
  };

  const rotation = getRandomNumber(-60, 60);

  const handleClick = () => {
    setOpenModal(true);
  };

  const actualStatus = () => {
    if (idx % 3 === 0) return Status.Owned;
    if (idx % 2 === 0) return Status.Unavailable;
    return Status.Vacant;
  };

  return (
    <>
      <AnimatedDiv
        onMouseEnter={() => handleEnter()}
        onMouseLeave={() => setHovering(false)}
        onClick={() => handleClick()}
        bg={colour}
        h={`${gridSize / 10}px`}
        w={`${gridSize / 10}px`}
        cursor="pointer"
        border="0.5px solid white"
        animate={{
          scale: hovering ? [1, 1.3] : justRendered ? 1 : [1.3, 1],
          borderRadius: hovering
            ? ["0px", "5px"]
            : justRendered
            ? "0px"
            : ["5px", "0px"],
          borderWidth: hovering ? 2 : 0.5,
          rotate: hovering ? [0, rotation] : justRendered ? 0 : [rotation, 0],
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
            idx={idx + 1}
            status={actualStatus()}
            colour={colour}
          />
        }
      />
    </>
  );
};

export default GridParcel;
