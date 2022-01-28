import { PublicKey } from '@solana/web3.js'
import { useState, useEffect, useMemo } from 'react'
import { useNetworkType } from '.'
import { useConnection } from '../../contexts/connection'
import { useStatesContext } from '../../contexts/states'
import { useWeb3React } from "@web3-react/core";
import { useWallet } from '@solana/wallet-adapter-react'
import { Token, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import ERC20_ABI from './abi/erc20.json'
export function useTokenList () {
  const { chainId } = useNetworkType()
  const [sourceList, setSourceList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const {direction} = useStatesContext()
  const connection = useConnection()
  const {library, account} = useWeb3React()
  const { publicKey } = useWallet()
  console.log(library, account)


  const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const getSplBalance = async (token) => {
    const pubkey = new PublicKey(token.address_spl)
    const assocTokenAccountAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      pubkey,
      publicKey
    )
    console.log(connection)
    const completed = await Promise.all([
      connection.getTokenAccountBalance(assocTokenAccountAddress),
      timeout(500)
    ]).catch(error => {
      console.warn(error)
      return [0, undefined]
    })
    const balanceData = completed[0]
    if (balanceData === 0) return 0
    if (balanceData && balanceData.value && balanceData.value.uiAmount) {
      return balanceData.value.uiAmount
    }
    return completed[0]
  }

  const getEthBalance = async (token) => {
    const tokenInstance = new library.eth.Contract(ERC20_ABI, token.address)
    let balance = await tokenInstance.methods.balanceOf(account).call()
    balance = balance / Math.pow(10, token.decimals)
    
    console.log(balance, token.decimals)
    // library.eth.getBalance(token.address)
    
    return balance
  }

  const mergeTokenList = async (source = []) => {
    const list = []
    setLoading(true)
    for (const item of source) {
      let balance = 0
      try {
        balance = direction === 'neon' ? await getSplBalance(item) : await getEthBalance(item)
      } catch (e) {
        console.dir(e)
        // setError(e)
      }
      console.log(balance)
      const token = Object.assign({}, item, {balance})
      list.push(token)
    }
    setSourceList(list)
    setLoading(false)
  }
  useEffect(() => {
    setLoading(true)
    fetch(`https://raw.githubusercontent.com/neonlabsorg/token-list/main/tokenlist.json`)
    .then((resp) => {
      if (resp.ok) {
        resp.json().then(data => {
          mergeTokenList(data.tokens)
        })
          .catch((err) => setError(err.message))
      }
    })
    .catch(err => {
      setError(`Failed to fetch neon transfer token list: ${err.message}`)
    }).finally(() => setLoading(false))
  // eslint-disable-next-line
  }, [chainId])
  const filteringChainId = useMemo(() => {
    if (isNaN(chainId)) return 111
    else return chainId
  }, [chainId])
  const list = useMemo(() => {
    const filtered = sourceList.filter(token => {
      return token.chainId === filteringChainId
    })
    return filtered
  }, [filteringChainId, sourceList])
  return { list, error, loading }
}