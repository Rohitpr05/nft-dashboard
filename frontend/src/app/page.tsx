'use client'

import { useState } from 'react'
import WalletConnect from './components/WalletConnect'
import Dashboard from './components/Dashboard'
import BadgePreview from './components/BadgePreview'

export default function Home() {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')

  const handleWalletConnected = (address: string, walletBalance: string) => {
    setAccount(address)
    setBalance(walletBalance)
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
              <div className="text-sm text-gray-500">
                Connect with MetaMask to get started
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-800/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Mood NFT Dashboard. Built with Next.js & Hardhat.</p>
            <p className="text-xs mt-2">Contract: 0x27575353C3C274C44b3EA1d504ECF9525327a411</p>
          </div>
        </div>
      </footer>
    </div>
  )
}