import { useCallback, useEffect, useState } from "react";
import { useAccount, useProvider } from "wagmi";
import { Provider } from "../../constants/app";
import getMBloxBalance from "../../contract-helpers/getMBloxBalance";

/**
 * Hook that handles all the functionality regarding the MBlox value and its changes in the app
 * @returns The user's MBLOX balance, and the expected MBlox value setter
 */
const useCheckMBloxBalance = () => {
  const provider = useProvider();
  const { address } = useAccount();

  const [mBloxBalance, setMBloxBalance] = useState(0);
  const [oldMBloxBalance, setOldMBloxBalance] = useState<string | undefined>(
    undefined
  );
  const [checkingMBlox, setCheckingMBlox] = useState(false);

  let interval: any = null;

  const retrieveBalance = useCallback(
    async (provider: Provider, address: string) => {
      const balance = await getMBloxBalance(provider, address);
      setMBloxBalance(balance ?? 0.0);
    },
    [provider, address]
  );

  useEffect(() => {
    if (mBloxBalance !== Number(oldMBloxBalance) && checkingMBlox) {
      clearInterval(interval);
      setOldMBloxBalance(undefined);
      setCheckingMBlox(false);
    }
  }, [mBloxBalance, oldMBloxBalance]);

  useEffect(() => {
    if (provider && address && oldMBloxBalance) {
      if (!checkingMBlox) {
        setCheckingMBlox(true);
        interval = setInterval(() => {
          retrieveBalance(provider, address);
        }, 1000);
      }
    }
    return () => {
      clearInterval(interval);
    };
  }, [provider, address, oldMBloxBalance, mBloxBalance]);

  return { mBloxBalance, setOldMBloxBalance, retrieveBalance };
};

export default useCheckMBloxBalance;
