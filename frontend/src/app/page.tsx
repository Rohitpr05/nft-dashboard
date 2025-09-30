'use client'

import { useState, useEffect } from 'react'
import WalletConnect from './components/WalletConnect'
import Dashboard from './components/Dashboard'
import BadgePreview from './components/BadgePreview'
import { getETHBalance, checkNetwork } from '@/utils/web3'

export default function Home() {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if the URL contains a transaction hash parameter for deep linking
    const params = new URLSearchParams(window.location.search)
    const txHash = params.get('tx')
    if (txHash) {
      console.log('Transaction hash detected in URL:', txHash)
      // Could implement transaction status checking here
    }
  }, [])

  const handleWalletConnected = async (address: string, walletBalance: string) => {
    setIsLoading(true)
    
    try {
      setAccount(address)
      
      if (address) {
        // Double-check the balance
        const realBalance = await getETHBalance(address)
        setBalance(realBalance)
        
        // Verify network
        const networkInfo = await checkNetwork()
        setIsCorrectNetwork(networkInfo.isCorrectNetwork)
      } else {
        // Reset on disconnect
        setBalance('')
        setIsCorrectNetwork(true)
      }
    } catch (error) {
      console.error('Error in wallet connection handler:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold glow-text">
                🔮 Mood NFT Dashboard
              </h1>
            </div>
            <WalletConnect onWalletConnected={handleWalletConnected} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="text-center py-4 mb-4 bg-blue-900/20 rounded-lg">
            <p className="text-blue-400">Loading blockchain data...</p>
          </div>
        )}
        
        {!isCorrectNetwork && account && (
          <div className="text-center py-4 mb-4 bg-yellow-900/20 rounded-lg">
            <p className="text-yellow-400">⚠️ Please switch to Sepolia testnet to interact with the NFT contract.</p>
          </div>
        )}
        
        {account ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard takes 2 columns */}
            <div className="lg:col-span-2">
              <Dashboard account={account} balance={balance} />
            </div>
            
            {/* Badge Preview takes 1 column */}
            <div className="lg:col-span-1">
              <BadgePreview account={account} />
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-8 animate-pulse">🔮</div>
              <h2 className="text-3xl font-bold glow-text mb-4">
                Welcome to Mood NFT Dashboard
              </h2>
              <p className="text-gray-400 mb-8">
                Connect your wallet to view your portfolio and mint dynamic NFTs 
                that change based on market conditions.
              </p>
              <div className="space-y-4">
                <div className="text-sm text-gray-500">
                  Connect with MetaMask to get started
                </div>
                <div className="text-xs text-gray-600 max-w-sm mx-auto">
                  This app uses the Sepolia testnet. Make sure you have Sepolia ETH to mint NFTs. 
                  You can get free Sepolia ETH from a faucet like 
                  <a href="https://sepoliafaucet.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 ml-1">
                    sepoliafaucet.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2025 Mood NFT Dashboard. Built with Next.js & Hardhat.</p>
            <p className="text-xs mt-2">Contract: 0x27575353C3C274C44b3EA1d504ECF9525327a411 on Sepolia</p>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="https://sepolia.etherscan.io/address/0x27575353C3C274C44b3EA1d504ECF9525327a411" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
              View Contract on Etherscan
            </a>
            <a href="https://github.com/your-username/mood-nft" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:text-blue-300">
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}