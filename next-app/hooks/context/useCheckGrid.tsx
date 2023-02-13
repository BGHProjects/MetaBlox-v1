import { useEffect, useState } from "react";
import { useProvider } from "wagmi";
import { Provider } from "../../constants/app";
import getGridData from "../../contract-helpers/getGridData";

const useCheckGrid = () => {
  const provider = useProvider();

  const [gridData, setGridData] = useState([]);

  const retrieveGridData = async (provider: Provider) => {
    const contractGridData = await getGridData(provider);
    setGridData(contractGridData ?? []);
  };

  useEffect(() => {
    if (provider) retrieveGridData(provider);
  }, [provider]);

  return { gridData };
};

export default useCheckGrid;
