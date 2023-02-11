import { Signer } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import getAllMetaBloxBalances from "../../contract-helpers/getAllMetaBloxBalances";

const useCheckMetaBlockBalances = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const [metaBloxBalances, setMetaBloxBalances] = useState(Array(10).fill(0));
  const [expectedMetaBloxBalances, setExpectedMBloxBalances] = useState(
    Array(10).fill(0)
  );
  const [checkingMetaBlox, setCheckingMetaBlox] = useState(false);

  const retrieveBalances = async (signer: Signer, address: string) => {
    const balances = await getAllMetaBloxBalances(signer, address);
    setMetaBloxBalances(balances as Array<number>);
  };

  useEffect(() => {
    if (signer && address) {
      retrieveBalances(signer, address);
    }
  }, [signer, address]);

  return { metaBloxBalances };
};

export default useCheckMetaBlockBalances;
