import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import { useStatesContext } from '../../../contexts/states'
import { useNeonTransfer } from '../../vendor'

export const useTransfering = () => {
  const {setPending, setTransfering, rejected} = useStatesContext()
  const {publicKey} = useWallet()
  const {account} = useWeb3React()
  const { createNeonTransfer, createSolanaTransfer } = useNeonTransfer({
    onBeforeCreateInstruction: () => {
      setPending(true)
    },
    onBeforeSignTransaction: () => {
      if (rejected.current === true) {
        setPending(false)
        rejected.current = false
        return
      }
      setTransfering(true)
    },
    onSuccessSign: (sig, txHash) => {
      setSolanaTransferSign(sig, txHash)
      setTransfering(false)
      addTransaction({from: publicKey.toBase58(), to: account})
      setPending(false)
    },
    onErrorSign: (e) => {
      setError(e.message)
      setTransfering(false)
      setPending(false)
    }
  })
  return { createNeonTransfer, createSolanaTransfer }
}

