import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useProvider } from "wagmi";
import { Provider } from "../../constants/app";
import getGridData from "../../contract-helpers/getGridData";

const useCheckGrid = () => {
  const provider = useProvider();

  const [gridData, setGridData] = useState([]);
  const [oldGridData, setOldGridData] = useState<any[]>([]);
  const [checkingGridData, setCheckingGridData] = useState(false);
  const [startCheckingGridData, setStartCheckingGridData] = useState(false);

  let interval: any = null;

  const retrieveGridData = async (provider: Provider) => {
    const contractGridData = await getGridData(provider);
    setGridData(contractGridData ?? []);
  };

  useEffect(() => {
    if (checkingGridData && !isEqual(gridData, oldGridData)) {
      clearInterval(interval);
      setOldGridData([]);
      setCheckingGridData(false);
      setStartCheckingGridData(false);
    }
  }, [gridData, oldGridData]);

  useEffect(() => {
    if (provider && startCheckingGridData) {
      if (!checkingGridData) {
        setCheckingGridData(true);
        interval = setInterval(() => {
          retrieveGridData(provider);
        }, 1000);
      }
    }
  }, [provider, startCheckingGridData]);

  return {
    gridData,
    retrieveGridData,
    setStartCheckingGridData,
    setOldGridData,
  };
};

export default useCheckGrid;
