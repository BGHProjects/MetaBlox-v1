import { useEffect, useState } from "react";
import { useProvider, useSigner } from "wagmi";
import { Provider } from "../../constants/app";
import getGridData from "../../contract-helpers/getGridData";

const useCheckGrid = () => {
  const { data: signer } = useSigner();
  const provider = useProvider();

  const [gridData, setGridData] = useState([]);
  const [expectedGridData, setExpectedGridData] = useState([]);
  const [checkingGridData, setCheckingGridData] = useState(false);

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
