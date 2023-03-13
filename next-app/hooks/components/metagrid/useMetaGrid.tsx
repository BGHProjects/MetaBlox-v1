import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useProvider } from "wagmi";
import { GameState } from "../../../constants/game";
import { useAppContext } from "../../../contexts/AppStateContext";
import getWorldData from "../../../contract-helpers/getWorldData";
import calcXY from "../../../helpers/calcXY";
import useKeyboard from "../../useKeyboard";

const useMetaGrid = (animDuration: number) => {
  const cellSize = 100;
  const grid = Array.from(Array(100).keys());

  const {
    gridData,
    convertOnChainCubesToGame,
    setEnteringMetaGrid,
    setGameState,
    setMetaGridLoaded,
  } = useAppContext();
  const provider = useProvider();
  const { quit } = useKeyboard();
  const router = useRouter();

  const [exiting, setExiting] = useState(false);
  const [display, setDisplay] = useState("flex");
  const [cellCubes, setCellCubes] = useState<any>({});

  const quitFunction = () => {
    setDisplay("flex");
    setMetaGridLoaded(false);
    setExiting(true);
    setGameState(GameState.None);
    setTimeout(() => {
      router.push("/");
    }, (animDuration + 1) * 1000);
  };

  const populateSingleWorld = async (
    cell: number,
    x: number,
    y: number,
    xOffset: number,
    yOffset: number
  ) => {
    let cubes: any[] = [];

    const thisWorld = gridData.find(
      (gridItem) =>
        Number(ethers.utils.formatUnits(gridItem.x, "wei")) === x &&
        Number(ethers.utils.formatUnits(gridItem.y, "wei")) === y
    );

    if (!thisWorld) return cubes;

    const worldId = Number(ethers.utils.formatUnits(thisWorld.id, "wei"));
    const world = await getWorldData(worldId, provider);
    const worldLayout = world.worldBlockDetails.worldLayout;

    if (worldLayout === "[]") return cubes;

    cubes = convertOnChainCubesToGame(worldLayout, xOffset, yOffset);

    setCellCubes((prev: any) => {
      return { ...prev, [cell]: cubes };
    });
  };

  const populateAllWorlds = () => {
    grid.forEach(async (cell) => {
      const { x, y } = calcXY(cell + 1);
      const xOffset = cellSize * 1.5 * x;
      const zOffset = cellSize * 1.5 * y;
      await populateSingleWorld(cell, x, y, xOffset, zOffset);
    });
  };

  useEffect(() => {
    setEnteringMetaGrid(false);
    populateAllWorlds();
  }, [gridData]);

  useEffect(() => {
    if (quit) quitFunction();
  }, [quit]);

  return { cellSize, grid, cellCubes, exiting, display };
};

export default useMetaGrid;
