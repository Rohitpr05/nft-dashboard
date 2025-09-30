'use client'

import { useState, useEffect, useCallback } from 'react'

interface WalletConnectProps {
  onWalletConnected?: (address: string, balance: string) => void
}

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function WalletConnect({ onWalletConnected }: WalletConnectProps) {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMetaMaskAvailable, setIsMetaMaskAvailable] = useState<boolean | null>(null)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch by waiting for mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const checkMetaMaskAvailability = useCallback(async () => {
    if (typeof window === 'undefined') return false

    if (window.ethereum) {
      setIsMetaMaskAvailable(true)
      return true
    }

    // Wait a bit for MetaMask to load
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (window.ethereum) {
      setIsMetaMaskAvailable(true)
      return true
    }

    setIsMetaMaskAvailable(false)
    return false
  }, [])

  const getBalance = useCallback(async (address: string): Promise<string> => {
    try {
      if (!window.ethereum) return '0'
      
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      
      const balanceInEth = parseInt(balance, 16) / Math.pow(10, 18)
      const formattedBalance = balanceInEth.toFixed(4)
      setBalance(formattedBalance)
      return formattedBalance
    } catch (error) {
      console.error('Error getting balance:', error)
      return '0'
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initWallet = async () => {
      const isAvailable = await checkMetaMaskAvailability()
      if (!isAvailable) return

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          const walletBalance = await getBalance(accounts[0])
          onWalletConnected?.(accounts[0], walletBalance)
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error)
      }
    }

    initWallet()
  }, [mounted, checkMetaMaskAvailability, getBalance, onWalletConnected])

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      if (!window.ethereum) {
        alert('MetaMask not detected. Please install MetaMask and refresh.')
        return
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        const walletBalance = await getBalance(accounts[0])
        onWalletConnected?.(accounts[0], walletBalance)
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error)
      if (error.code === 4001) {
        alert('Please accept the connection request in MetaMask')
      } else {
        alert('Error connecting to MetaMask. Please try again.')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount('')
    setBalance('')
    onWalletConnected?.('', '0')
  }

  // Show loading state until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="flex items-center space-x-4">
        <button className="btn-primary opacity-50" disabled>
          Loading...
        </button>
      </div>
    )
  }

  // Show MetaMask install prompt after mounting
  if (isMetaMaskAvailable === false) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-400">
          <div>MetaMask not detected</div>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Install MetaMask
          </a>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="btn-secondary text-xs px-3 py-1"
        >
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      {account ? (
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <div className="text-gray-400">Connected:</div>
            <div className="font-mono text-blue-400">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Balance:</div>
            <div className="font-bold text-green-400">
              {parseFloat(balance).toFixed(4)} ETH
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="btn-secondary text-xs px-3 py-1"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting || isMetaMaskAvailable === null}
          className="btn-primary disabled:opacity-50"
        >
          {isConnecting ? 'Connecting...' : isMetaMaskAvailable === null ? 'Checking...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  )
}