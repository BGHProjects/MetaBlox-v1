import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Status } from "../../../constants/worldTokens";
import { useAppContext } from "../../../contexts/AppStateContext";
import useCheckGrid from "../../context/useCheckGrid";

/**
 * Hook used to separate the logic of the Grid Parcel from its JSX
 */
const useGridParcel = (idx: number) => {
  const [hovering, setHovering] = useState(false);
  const [justRendered, setJustRendered] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [colour, setColour] = useState("black");
  const [status, setStatus] = useState(Status.Vacant);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const { gridData } = useCheckGrid();
  const { playerColour } = useAppContext();

  const calculateXY = (idx: number) => {
    let x = idx % 10 === 0 ? 10 : idx % 10;
    let y = Math.ceil(idx / 10);
    setCoords({ x, y });
  };

  const handleEnter = () => {
    setJustRendered(false);
    setHovering(true);
  };

  const handleClick = () => {
    setOpenModal(true);
  };

  const determineAttributes = () => {
    const thisWorld = gridData.find(
      (gridItem) =>
        Number(ethers.utils.formatUnits(gridItem.x, "wei")) === coords.x &&
        Number(ethers.utils.formatUnits(gridItem.y, "wei")) === coords.y
    );

    if (!thisWorld) {
      return;
    }

    if (playerColour === thisWorld.colour) {
      setStatus(Status.Owned);
    } else {
      setStatus(Status.Unavailable);
    }

    setColour(thisWorld.colour);
  };

  useEffect(() => {
    if (gridData) {
      calculateXY(idx);
      determineAttributes();
    }
  }, [gridData]);

  return {
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
  };
};

export default useGridParcel;
