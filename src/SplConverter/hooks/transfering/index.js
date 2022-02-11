import { useNeonTransfer } from '../../vendor'

export const useTransfering = () => {
  const { createNeonTransfer, createSolanaTransfer, /*getNeonAccount*/ } = useNeonTransfer({
    onBeforeCreateInstruction: () => {
      console.log('before create')
    },
    onBeforeSignTransaction: () => {
      console.log('before sign')
    }
    ,
    onBeforeSignTransaction: () => {
      console.log('before sign')
    }
  })
  return { createNeonTransfer, createSolanaTransfer }
}

