import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '../../contexts/connection';
import { useWeb3React } from '@web3-react/core'
import NeonPortal from './NeonPortal'

export const useNeonTransfer = (events) => {
  const connection = useConnection()
  const { account } = useWeb3React()
  const { publicKey } = useWallet()
  let portal = new NeonPortal({
    solanaWalletAddress: publicKey,
    neonWalletAddress: account,
    customConnection: connection
  })
  const createNeonTransfer = portal.createNeonTransfer.bind(portal, events)
  const createSolanaTransfer = portal.createSolanaTransfer.bind(portal, events)
  return { createNeonTransfer, createSolanaTransfer }
}
