import { Signer } from "ethers";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import getAllMetaBloxBalances from "../../contract-helpers/getAllMetaBloxBalances";

const useCheckMetaBlockBalances = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const [metaBloxBalances, setMetaBloxBalances] = useState(Array(10).fill(0));
  const [expectedMetaBloxBalances, setExpectedMetaBloxBalances] = useState(
    Array(10).fill(0)
  );
  const [checkingMetaBlox, setCheckingMetaBlox] = useState(false);

  let interval: any = null;

  const retrieveBalances = async (signer: Signer, address: string) => {
    const balances = await getAllMetaBloxBalances(signer, address);
    setMetaBloxBalances(balances as Array<number>);
  };

  /**
   * Initially retrieves the balances
   */
  useEffect(() => {
    if (signer && address) {
      retrieveBalances(signer, address);
    }
  }, [signer, address]);

  /**
   * Handles stopping the check
   */
  useEffect(() => {
    if (isEqual(metaBloxBalances, expectedMetaBloxBalances)) {
      clearInterval(interval);
      setExpectedMetaBloxBalances(Array(10).fill(0));
      setCheckingMetaBlox(false);
    }
  }, [metaBloxBalances, expectedMetaBloxBalances]);

  /**
   * Continuously checks for the new balances
   */
  useEffect(() => {
    if (signer && address && expectedMetaBloxBalances) {
      if (!checkingMetaBlox) {
        setCheckingMetaBlox(true);
        interval = setInterval(() => {
          retrieveBalances(signer, address);
        }, 1000);
      }
    }
  }, [signer, address, expectedMetaBloxBalances, metaBloxBalances]);

  return { metaBloxBalances, setExpectedMetaBloxBalances };
};

export default useCheckMetaBlockBalances;
