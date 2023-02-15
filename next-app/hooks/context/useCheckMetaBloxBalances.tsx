import { isEqual } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { Provider } from "../../constants/app";
import getAllMetaBloxBalances from "../../contract-helpers/getAllMetaBloxBalances";

const useCheckMetaBlockBalances = () => {
  const provider = useProvider();
  const { address } = useAccount();

  const [metaBloxBalances, setMetaBloxBalances] = useState(Array(10).fill(0));
  const [oldMetaBloxBalances, setOldMetaBloxBalances] = useState(
    Array(10).fill(0)
  );
  const [checkingMetaBlox, setCheckingMetaBlox] = useState(false);
  const [startCheckingMetaBlox, setStartCheckingMetaBlox] = useState(false);

  let interval: any = null;

  const retrieveBalances = useCallback(
    async (provider: Provider, address: string) => {
      const balances = await getAllMetaBloxBalances(provider, address);
      setMetaBloxBalances(balances as Array<number>);
    },
    [provider, address]
  );

  useEffect(() => {
    if (checkingMetaBlox && !isEqual(metaBloxBalances, oldMetaBloxBalances)) {
      clearInterval(interval);
      setOldMetaBloxBalances(Array(10).fill(0));
      setCheckingMetaBlox(false);
      setStartCheckingMetaBlox(false);
    }
  }, [metaBloxBalances, oldMetaBloxBalances]);

  useEffect(() => {
    if (provider && address && startCheckingMetaBlox) {
      if (!checkingMetaBlox) {
        setCheckingMetaBlox(true);
        interval = setInterval(() => {
          retrieveBalances(provider, address);
        }, 1000);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [provider, address, startCheckingMetaBlox]);

  return {
    metaBloxBalances,
    setOldMetaBloxBalances,
    retrieveBalances,
    setStartCheckingMetaBlox,
  };
};

export default useCheckMetaBlockBalances;
