import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '../../contexts/connection';
import { useWeb3React } from '@web3-react/core'
import {useRef, useEffect} from 'react'
import NeonPortal from './NeonPortal'

export const useNeonTransfer = (events) => {
  const connection = useConnection()
  const { account } = useWeb3React()
  const { publicKey } = useWallet()
  const transferrer = useRef()
  transferrer.current = new NeonPortal({
    solanaWalletAddress: publicKey,
    neonWalletAddress: account,
    customConnection: connection,
    ...events
  })
  useEffect(() => {
    transferrer.current = new NeonPortal({
      solanaWalletAddress: publicKey,
      neonWalletAddress: account,
      customConnection: connection,
      ...events
    })
    return () => transferrer.current = null
  }, [publicKey, account, connection])
  const { createNeonTransfer, createSolanaTransfer, getNeonAccount } = transferrer.current
  return { createNeonTransfer, createSolanaTransfer, getNeonAccount }
}
