import useLoadTexture from "../../hooks/components/metagrid/useLoadTexture";
import usePositionPlane from "../../hooks/components/metagrid/usePositionPlane";

const height = -0.5;

interface IGridTile {
  cellSize: number;
  xOffset?: number;
  zOffset?: number;
  rowEnd?: boolean;
  colEnd?: boolean;
}

const GridTile = ({
  cellSize,
  xOffset = 0,
  zOffset = 0,
  rowEnd = false,
  colEnd = false,
}: IGridTile) => {
  const baseRef = usePositionPlane({
    rotX: -Math.PI / 2,
    posY: height,
    posX: xOffset,
    posZ: zOffset,
  });

  const topEdge = usePositionPlane({
    rotX: -Math.PI / 2,
    posX: xOffset,
    posY: height,
    posZ: -cellSize * (3 / 4) + zOffset,
  });
  const leftEdge = usePositionPlane({
    rotX: -Math.PI / 2,
    posX: -cellSize * (3 / 4) + xOffset,
    posY: height,
    posZ: -cellSize / 4 + zOffset,
  });
  const rightEdge = usePositionPlane({
    rotX: -Math.PI / 2,
    posX: cellSize * (3 / 4) + xOffset,
    posY: height,
    posZ: -cellSize / 4 + zOffset,
  });

  const bottomEdge = usePositionPlane({
    rotX: -Math.PI / 2,
    posX: colEnd && rowEnd ? xOffset : -cellSize / 4 + xOffset,
    posY: height,
    posZ: cellSize * (3 / 4) + zOffset,
  });

  const baseTexture = useLoadTexture(
    "/images/sandbox-cell.png",
    cellSize,
    cellSize
  );
  const topEdgeTexture = useLoadTexture(
    "/images/matrix.jpg",
    cellSize,
    cellSize / 2
  );
  const lateralTexture = useLoadTexture(
    "/images/matrix.jpg",
    cellSize / 2,
    cellSize * (3 / 2)
  );
  const bottomTexture = useLoadTexture(
    "/images/matrix.jpg",
    colEnd && rowEnd ? cellSize * 2 : cellSize * (3 / 2),
    cellSize / 2
  );

  return (
    <>
      <mesh ref={baseRef as any}>
        <planeGeometry attach="geometry" args={[cellSize, cellSize]} />
        <meshStandardMaterial attach="material" map={baseTexture} />
      </mesh>
      <mesh ref={topEdge as any}>
        <planeGeometry attach="geometry" args={[cellSize, cellSize / 2]} />
        <meshStandardMaterial attach="material" map={topEdgeTexture} />
      </mesh>
      <mesh ref={leftEdge as any}>
        <planeGeometry
          attach="geometry"
          args={[cellSize / 2, cellSize * (3 / 2)]}
        />
        <meshStandardMaterial attach="material" map={lateralTexture} />
      </mesh>
      {rowEnd && (
        <mesh ref={rightEdge as any}>
          <planeGeometry
            attach="geometry"
            args={[cellSize / 2, cellSize * (3 / 2)]}
          />
          <meshStandardMaterial attach="material" map={lateralTexture} />
        </mesh>
      )}

      {colEnd && (
        <mesh ref={bottomEdge as any}>
          <planeGeometry
            attach="geometry"
            args={[
              colEnd && rowEnd ? cellSize * 2 : cellSize * (3 / 2),
              cellSize / 2,
            ]}
          />
          <meshStandardMaterial attach="material" map={bottomTexture} />
        </mesh>
      )}
    </>
  );
};

export default GridTile;
