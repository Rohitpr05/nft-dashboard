'use client'

import { useState, useEffect } from 'react'
import { getETHBalance, checkNetwork } from '@/utils/web3'

interface WalletConnectProps {
  onWalletConnected?: (address: string, balance: string) => void
}

export default function WalletConnect({ onWalletConnected }: WalletConnectProps) {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [networkStatus, setNetworkStatus] = useState({ isCorrectNetwork: true, currentNetwork: '', requiredNetwork: 'sepolia' })
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    setMounted(true)
    
    // Check if previously connected
    checkIfConnected()
    
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', () => window.location.reload())
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])
  
  // Check if wallet is already connected
  const checkIfConnected = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        const account = accounts[0]
        await connectWallet(account)
      }
    } catch (error) {
      console.error('Failed to check if connected:', error)
    }
  }
  
  // Handle account changes
  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      handleDisconnect()
    } else {
      // Account changed
      await connectWallet(accounts[0])
    }
  }
  
  // Connect wallet
  const connectWallet = async (address: string) => {
    try {
      // Verify network
      const networkInfo = await checkNetwork()
      setNetworkStatus(networkInfo)
      
      if (!networkInfo.isCorrectNetwork) {
        alert(`Please switch to ${networkInfo.requiredNetwork} network. Currently connected to: ${networkInfo.currentNetwork}`)
      }
      
      // Get balance
      const balance = await getETHBalance(address)
      
      // Update state
      setAccount(address)
      setBalance(balance)
      
      // Notify parent
      onWalletConnected?.(address, balance)
      
    } catch (error) {
      console.error('Error connecting wallet:', error)
      setAccount('')
      setBalance('')
    }
  }

  const debugMetaMask = () => {
    if (typeof window === 'undefined') {
      setDebugInfo('Window undefined')
      return
    }

    const ethereum = (window as any).ethereum
    const info = {
      hasEthereum: !!ethereum,
      isMetaMask: ethereum?.isMetaMask,
      isConnected: ethereum?.isConnected?.(),
      chainId: ethereum?.chainId,
      selectedAddress: ethereum?.selectedAddress
    }
    
    setDebugInfo(JSON.stringify(info, null, 2))
    console.log('MetaMask Debug Info:', info)
  }

  const handleConnect = async () => {
    setIsConnecting(true)
    
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to connect')
        return
      }

      console.log('Requesting accounts...')
      
      // Request accounts
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      console.log('Got accounts:', accounts)
      
      if (accounts && accounts.length > 0) {
        await connectWallet(accounts[0])
      }
      
    } catch (error: any) {
      console.error('Connection error:', error)
      alert(`Error: ${error.message || 'Unknown error'}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setAccount('')
    setBalance('')
    setDebugInfo('')
    onWalletConnected?.('', '0')
  }
  
  const switchNetwork = async () => {
    if (!window.ethereum) return
    
    try {
      // Switch to Sepolia testnet
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
      })
    } catch (switchError: any) {
      // Network doesn't exist in wallet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }
            ]
          })
        } catch (error) {
          console.error('Failed to add network:', error)
        }
      } else {
        console.error('Failed to switch network:', switchError)
      }
    }
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      {/* Debug info */}
      {debugInfo && (
        <div className="text-xs font-mono bg-gray-800 p-2 rounded max-w-xs overflow-auto">
          <pre>{debugInfo}</pre>
        </div>
      )}
      
      {/* Network warning */}
      {account && !networkStatus.isCorrectNetwork && (
        <div className="text-xs text-yellow-400 bg-yellow-900/20 p-2 rounded max-w-xs">
          <div className="font-semibold">⚠️ Wrong Network</div>
          <div>Currently on: {networkStatus.currentNetwork}</div>
          <div>Please connect to {networkStatus.requiredNetwork}</div>
          <button 
            onClick={switchNetwork}
            className="text-xs px-2 py-1 mt-2 bg-yellow-800 rounded hover:bg-yellow-700"
          >
            Switch Network
          </button>
        </div>
      )}

      <div className="flex items-center space-x-2">
        {/* Debug button */}
        <button
          onClick={debugMetaMask}
          className="btn-secondary text-xs px-2 py-1"
        >
          Debug
        </button>

        {account ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="text-gray-400">Connected:</div>
              <div className="font-mono text-blue-400">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              {balance && (
                <div className="text-xs text-green-400">{parseFloat(balance).toFixed(4)} ETH</div>
              )}
            </div>
            <button
              onClick={handleDisconnect}
              className="btn-secondary text-xs px-3 py-1"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="btn-primary disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  )
}