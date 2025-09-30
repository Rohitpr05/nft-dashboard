'use client'

import { useState, useEffect } from 'react'

interface DashboardProps {
  account: string
  balance: string
}

export default function Dashboard({ account, balance }: DashboardProps) {
  const [ethPrice, setEthPrice] = useState(0)
  const [gasPrice, setGasPrice] = useState(0)

  useEffect(() => {
    fetchMarketData()
  }, [])

  const fetchMarketData = async () => {
    try {
      // Simulated data - in production, use a real API
      setEthPrice(2000 + Math.random() * 500)
      setGasPrice(20 + Math.random() * 30)
    } catch (error) {
      console.error('Error fetching market data:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">ETH Price</h3>
          <p className="text-2xl font-bold glow-text">
            ${ethPrice.toFixed(2)}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Gas Price</h3>
          <p className="text-2xl font-bold text-green-400">
            {gasPrice.toFixed(0)} gwei
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Portfolio Value</h3>
          <p className="text-2xl font-bold text-pink-400">
            ${(parseFloat(balance || '0') * ethPrice).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 glow-text">Balance History</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">📈 Chart coming soon!</p>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 glow-text">Portfolio Distribution</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">🥧 Pie chart coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  )
}