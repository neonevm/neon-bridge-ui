import { Connection, PublicKey } from '@solana/web3.js';
import { TransactionConfig } from 'web3-core';
import Web3 from 'web3';
import {
  InstructionEvents,
  InstructionParams,
  MintPortal,
  NeonPortal,
  NeonProxyRpcApi,
  SPLToken
} from 'neon-portal';
import { useProxyInfo } from './proxy-status';

const urls = process.env.REACT_APP_URLS ? JSON.parse(process.env.REACT_APP_URLS) : {
  solanaRpcApi: 'https://api.devnet.solana.com',
  neonProxyRpcApi: 'https://devnet.neonevm.org'
};

export const proxyApi = new NeonProxyRpcApi({
  solanaRpcApi: urls.solanaRpcApi,
  neonProxyRpcApi: urls.neonProxyRpcApi
});

export function useNeonTransfer(events: InstructionEvents, connection: Connection, web3: Web3, publicKey: PublicKey, neonWalletAddress: string) {
  const proxyStatus = useProxyInfo(proxyApi);
  const options: InstructionParams = {
    connection: connection,
    solanaWalletAddress: publicKey,
    neonWalletAddress,
    web3,
    proxyApi: proxyApi,
    proxyStatus: proxyStatus
  };

  const neonPortal = new NeonPortal(options);
  const mintPortal = new MintPortal(options);

  const portalInstance = (addr: string) => {
    return proxyStatus.NEON_TOKEN_MINT === addr ? neonPortal : mintPortal;
  };

  const getEthereumTransactionParams = (amount: number, splToken: SPLToken): TransactionConfig => {
    const portal = portalInstance(splToken.address_spl);
    return portal.ethereumTransaction.call(portal, amount, splToken);
  };

  const deposit = (amount: number, splToken: SPLToken): Promise<any> => {
    const portal = portalInstance(splToken.address_spl);
    return portal.createNeonTransfer.call(portal, amount, splToken, events);
  };

  const withdraw = (amount: number, splToken: SPLToken): Promise<any> => {
    const portal = portalInstance(splToken.address_spl);
    return portal.createSolanaTransfer.call(portal, amount, splToken, events);
  };

  return { deposit, withdraw, getEthereumTransactionParams, proxyStatus };
}
