import { createContext, useContext, useEffect, useMemo } from 'react';
import { clusterApiUrl, Connection } from '@solana/web3.js';
import { useLocalStorageState } from '@/utils';

const DEFAULT = clusterApiUrl(process.env.REACT_APP_NETWORK || ('mainnet-beta' as any));
const DEFAULT_SLIPPAGE = 0.25;
const ConnectionContext = createContext({
  endpoint: DEFAULT,
  setEndpoint: () => {
  },
  slippage: DEFAULT_SLIPPAGE,
  setSlippage: () => {
  },
  connection: new Connection(DEFAULT, 'recent')
});

export function ConnectionProvider({ children = undefined }) {
  const endpoint = DEFAULT;
  const [slippage, setSlippage] = useLocalStorageState('slippage', DEFAULT_SLIPPAGE.toString());
  const connection = useMemo(() => new Connection(endpoint, 'recent'), [endpoint]);

  useEffect(() => {
    const id = connection.onSlotChange(() => null);

    return () => {
      connection.removeSlotChangeListener(id);
    };
  }, [connection]);

  return (
    <ConnectionContext.Provider value={{
      endpoint,
      slippage: parseFloat(slippage),
      // @ts-ignore
      setSlippage: (val) => setSlippage(val.toString()),
      connection
    }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection(): Connection {
  return useContext(ConnectionContext).connection;
}

export function useConnectionConfig() {
  const context = useContext(ConnectionContext);

  return {
    endpoint: context.endpoint,
    setEndpoint: context.setEndpoint,
    connection: context.connection
  };
}
