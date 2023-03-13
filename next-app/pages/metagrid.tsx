import { chakra, Flex } from "@chakra-ui/react";
import { Physics } from "@react-three/cannon";
import { Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import { FPV, Player } from "../components/Gameplay";
import Cubes from "../components/Gameplay/Cubes/Cubes";
import ControlsCard from "../components/Gameplay/UI/ControlsCard";
import {
  GridTile,
  IntroText,
  MetaGridFade,
  MetaGridMap,
  MetaGridMenu,
} from "../components/MetaGrid";
import { useAppContext } from "../contexts/AppStateContext";
import calcXY from "../helpers/calcXY";
import useMetaGrid from "../hooks/components/metagrid/useMetaGrid";
import { ICube } from "../interfaces/cube";

const animDuration = 3;

const MetaGrid = () => {
  const { cellSize, grid, cellCubes, exiting, display } =
    useMetaGrid(animDuration);
  const { metaGridLoaded, metagridBG } = useAppContext();

  const pos = useRef([0, 0, 0]);

  return (
    <>
      {/* @ts-ignore */}
      <WindowContainer>
        <Canvas>
          <Environment
            background={true}
            files={[
              `/images/skyboxes/${metagridBG}/leftImage.png`,
              `/images/skyboxes/${metagridBG}/rightImage.png`,
              `/images/skyboxes/${metagridBG}/upImage.png`,
              `/images/skyboxes/${metagridBG}/downImage.png`,
              `/images/skyboxes/${metagridBG}/frontImage.png`,
              `/images/skyboxes/${metagridBG}/backImage.png`,
            ]}
          />

          <ambientLight intensity={0.5} />
          <FPV />
          <Physics>
            <Player
              xPos={cellSize * 1.5 * 5.5}
              zPos={cellSize * 1.5 * 5.5}
              pos={pos}
            />
            {grid.map((cell) => {
              const { x, y } = calcXY(cell + 1);
              const xOffset = cellSize * 1.5 * x;
              const zOffset = cellSize * 1.5 * y;

              return (
                <>
                  <Cubes cubes={cellCubes[cell] ?? []} />
                  <GridTile
                    cellSize={cellSize}
                    xOffset={xOffset}
                    zOffset={zOffset}
                    rowEnd={x === 10}
                    colEnd={y === 10}
                  />
                </>
              );
            })}
          </Physics>
        </Canvas>
        <MetaGridMenu />
        <ControlsCard showingSomething={false} setShowingSomething={() => {}} />
        <MetaGridMap pos={pos} />
        {metaGridLoaded && <IntroText otherAnimDuration={animDuration} />}
        <MetaGridFade
          display={display}
          animDuration={animDuration}
          exiting={exiting}
          metaGridLoaded={metaGridLoaded}
        />
      </WindowContainer>
    </>
  );
};

const WindowContainer = chakra(Flex, {
  baseStyle: {
    h: "100vh",
    w: "100%",
    position: "absolute",
  },
});

export default MetaGrid;
