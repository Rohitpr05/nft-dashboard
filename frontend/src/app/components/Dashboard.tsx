'use client'

import { useState, useEffect } from 'react'

interface DashboardProps {
  account: string
  balance: string
}

export default function Dashboard({ account, balance }: DashboardProps) {
  const [ethPrice, setEthPrice] = useState(0)
  const [gasPrice, setGasPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRealMarketData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchRealMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchRealMarketData = async () => {
    try {
      setLoading(true)
      
      // Fetch real ETH price from CoinGecko (free API)
      const ethResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
      const ethData = await ethResponse.json()
      
      if (ethData.ethereum?.usd) {
        setEthPrice(ethData.ethereum.usd)
      }

      // Fetch real gas prices from Etherscan (requires API key) or alternative
      try {
        const gasResponse = await fetch('https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=YourApiKeyToken')
        const gasData = await gasResponse.json()
        
        if (gasData.status === '1' && gasData.result?.ProposeGasPrice) {
          setGasPrice(parseInt(gasData.result.ProposeGasPrice))
        } else {
          // Fallback: fetch from wallet if Etherscan fails
          await fetchGasFromWallet()
        }
      } catch (gasError) {
        console.log('Etherscan API failed, using wallet method')
        await fetchGasFromWallet()
      }
      
    } catch (error) {
      console.error('Error fetching market data:', error)
      setError('Failed to fetch real market data')
    } finally {
      setLoading(false)
    }
  }

  const fetchGasFromWallet = async () => {
    try {
      if (window.ethereum) {
        const gasPrice = await window.ethereum.request({
          method: 'eth_gasPrice'
        })
        // Convert from wei to gwei
        const gasPriceGwei = parseInt(gasPrice, 16) / 1000000000
        setGasPrice(Math.round(gasPriceGwei))
      }
    } catch (error) {
      console.error('Error fetching gas price from wallet:', error)
      // Set a reasonable fallback
      setGasPrice(25)
    }
  }

  const portfolioValue = parseFloat(balance || '0') * ethPrice

  return (
    <div className="space-y-6">
      {/* Status indicator */}
      {loading && (
        <div className="text-sm text-yellow-400">
          Fetching real market data...
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
          {error} - Using fallback data
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            ETH Price 
            <span className="text-xs text-gray-500 ml-2">
              {loading ? '(loading...)' : '(live)'}
            </span>
          </h3>
          <p className="text-2xl font-bold glow-text">
            ${ethPrice.toLocaleString()}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">
            Gas Price 
            <span className="text-xs text-gray-500 ml-2">
              {loading ? '(loading...)' : '(live)'}
            </span>
          </h3>
          <p className="text-2xl font-bold text-green-400">
            {gasPrice} gwei
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Portfolio Value</h3>
          <p className="text-2xl font-bold text-pink-400">
            ${portfolioValue.toFixed(2)}
          </p>
          <div className="text-xs text-gray-500 mt-1">
            {balance} ETH × ${ethPrice.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Market Sentiment Indicator */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 glow-text">Market Sentiment</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg text-center ${gasPrice < 20 ? 'bg-green-900/30 border border-green-500' : 'bg-gray-700'}`}>
            <div className="text-2xl mb-2">🚀</div>
            <div className="text-sm">Bullish</div>
            <div className="text-xs text-gray-400">Gas &lt; 20 gwei</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${gasPrice >= 20 && gasPrice <= 40 ? 'bg-blue-900/30 border border-blue-500' : 'bg-gray-700'}`}>
            <div className="text-2xl mb-2">😎</div>
            <div className="text-sm">Neutral</div>
            <div className="text-xs text-gray-400">Gas 20-40 gwei</div>
          </div>
          
          <div className={`p-4 rounded-lg text-center ${gasPrice > 40 ? 'bg-red-900/30 border border-red-500' : 'bg-gray-700'}`}>
            <div className="text-2xl mb-2">😰</div>
            <div className="text-sm">Bearish</div>
            <div className="text-xs text-gray-400">Gas &gt; 40 gwei</div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 glow-text">Balance History</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Real-time charts coming soon!</p>
          </div>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 glow-text">Your NFT Collection</h3>
          <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Real blockchain NFTs will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}