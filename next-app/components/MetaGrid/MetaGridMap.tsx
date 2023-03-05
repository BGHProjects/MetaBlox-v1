import { Center, chakra, Flex } from "@chakra-ui/react";
import { MutableRefObject, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/AppStateContext";
import mapValue from "../../helpers/mapValue";
import BlurBackground from "../Menu/BlurBackground";
import MapCells from "./MapCells";

const mapSize = "300px";

export interface IMetaGridMap {
  pos: MutableRefObject<number[]>;
}

const MetaGridMap = ({ pos }: IMetaGridMap) => {
  const { playerColour } = useAppContext();
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const mappedX = mapValue(pos.current[0]);
    const mappedZ = mapValue(pos.current[2]);

    setCoords({ x: mappedX, y: mappedZ });
  }, [pos.current]);

  return (
    <MapContainer>
      <BlurBackground />
      <Center
        boxSize={mapSize}
        zIndex="1"
        overflow={"auto"}
        position="relative"
      >
        {/* @ts-ignore */}
        <PlayerIndicator
          top={`calc(${coords.y}% - 10px)`}
          left={`calc(${coords.x}% - 10px)`}
          bg={!!playerColour ? playerColour : "white"}
        />

        <MapCells />
      </Center>
    </MapContainer>
  );
};

const PlayerIndicator = chakra(Flex, {
  baseStyle: {
    position: "absolute",
    boxSize: "10px",
    borderRadius: "10px",
    border: "1px solid black",
    zIndex: "2",
  },
});

const MapContainer = chakra(Center, {
  baseStyle: {
    w: "fit-content",
    p: "10px",
    h: "fit-content",
    position: "absolute",
    left: `calc(100% - ${mapSize} - 40px)`,
    top: `calc(100% - ${mapSize} - 40px)`,
    m: "auto",
    borderRadius: "10px",
    flexDirection: "column",
  },
});

export default MetaGridMap;
