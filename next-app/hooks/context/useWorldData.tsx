import { useState } from "react";
import { useProvider } from "wagmi";
import getWorldData from "../../contract-helpers/getWorldData";

const useWorldData = () => {
  const provider = useProvider();
  const [worldData, setWorldData] = useState({});

  const retrieveWorldData = async (id: number) => {
    const world = await getWorldData(id, provider);
    setWorldData(world);
  };

  return { worldData, setWorldData, retrieveWorldData };
};

export default useWorldData;
