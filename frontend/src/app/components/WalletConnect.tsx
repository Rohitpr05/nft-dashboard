'use client'

import { useState, useEffect } from 'react'

interface WalletConnectProps {
  onWalletConnected?: (address: string, balance: string) => void
}

export default function WalletConnect({ onWalletConnected }: WalletConnectProps) {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const simpleConnect = async () => {
    setIsConnecting(true)
    
    try {
      if (!window.ethereum) {
        alert('No ethereum object found')
        return
      }

      console.log('Requesting accounts...')
      
      // Use the most basic connection method
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      })
      
      console.log('Got accounts:', accounts)
      
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0])
        setBalance('0.0000') // Set dummy balance for now
        onWalletConnected?.(accounts[0], '0.0000')
        alert(`Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`)
      }
      
    } catch (error: any) {
      console.error('Simple connect error:', error)
      alert(`Error: ${error.message || 'Unknown error'}`)
    } finally {
      setIsConnecting(false)
    }
  }

  const resetConnection = () => {
    setAccount('')
    setBalance('')
    setDebugInfo('')
    onWalletConnected?.('', '0')
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

      <div className="flex items-center space-x-2">
        {/* Debug button */}
        <button
          onClick={debugMetaMask}
          className="btn-secondary text-xs px-2 py-1"
        >
          Debug
        </button>

        {/* Reset button */}
        <button
          onClick={resetConnection}
          className="btn-secondary text-xs px-2 py-1"
        >
          Reset
        </button>

        {account ? (
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="text-gray-400">Connected:</div>
              <div className="font-mono text-blue-400">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            </div>
            <button
              onClick={resetConnection}
              className="btn-secondary text-xs px-3 py-1"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={simpleConnect}
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