import { Signer } from "ethers";
import { useEffect, useState } from "react";
import { useAccount, useSigner } from "wagmi";
import getMBloxBalance from "../../contract-helpers/getMBloxBalance";

/**
 * Hook that handles all the functionality regarding the MBlox value and its changes in the app
 * @returns The user's MBLOX balance, and the expected MBlox value setter
 */
const useCheckMBloxBalance = () => {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const [mBloxBalance, setMBloxBalance] = useState(0);
  const [expectedMBloxBalance, setExpectedMBloxBalance] = useState(0);
  const [checkingMBlox, setCheckingMBlox] = useState(false);

  let interval: any = null;

  const retrieveBalance = async (signer: Signer, address: string) => {
    const balance = await getMBloxBalance(signer, address);
    setMBloxBalance(balance ?? 0.0);
  };

  useEffect(() => {
    if (mBloxBalance === expectedMBloxBalance) {
      clearInterval(interval);
      setExpectedMBloxBalance(0);
      setCheckingMBlox(false);
    }
  }, [mBloxBalance, expectedMBloxBalance]);

  useEffect(() => {
    if (signer && address && expectedMBloxBalance) {
      if (!checkingMBlox) {
        setCheckingMBlox(true);
        {
          interval = setInterval(() => {
            retrieveBalance(signer, address);
          }, 1000);
        }
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [signer, address, expectedMBloxBalance, mBloxBalance]);

  useEffect(() => {
    if (signer && address) {
      retrieveBalance(signer, address);
    }
  }, [signer, address]);

  return { mBloxBalance, setExpectedMBloxBalance };
};

export default useCheckMBloxBalance;
