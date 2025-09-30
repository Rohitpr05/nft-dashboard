'use client'

import { useState, useEffect } from 'react'

interface BadgePreviewProps {
  account: string
}

export default function BadgePreview({ account }: BadgePreviewProps) {
  const [userNFTs, setUserNFTs] = useState<number[]>([])
  const [isMinting, setIsMinting] = useState(false)
  const [lastMintedId, setLastMintedId] = useState<number | null>(null)
  const [previewImage, setPreviewImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastTxHash, setLastTxHash] = useState('')

  useEffect(() => {
    if (lastMintedId) {
      generatePreview(lastMintedId)
    }
  }, [lastMintedId])

  const generatePreview = async (tokenId: number) => {
    try {
      const response = await fetch(`/api/metadata/${tokenId}`)
      const metadata = await response.json()
      setPreviewImage(metadata.image)
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  const simulateMint = async () => {
    if (!account) {
      alert('Please connect your wallet first!')
      return
    }

    setIsMinting(true)
    setError('')
    
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newTokenId = userNFTs.length + 1
      const fakeHash = '0x814458b9fbe4d7b0a90c94665b627d8810d719739990404d04f11f20415b19dc'
      
      setLastTxHash(fakeHash)
      setUserNFTs(prev => [...prev, newTokenId])
      setLastMintedId(newTokenId)
      
      alert(`Transaction sent! Hash: ${fakeHash}`)
      
      // Update preview after minting
      setTimeout(() => {
        generatePreview(newTokenId)
      }, 1000)
      
    } catch (error: any) {
      console.error('Minting failed:', error)
      setError(`Minting failed: ${error.message}`)
    } finally {
      setIsMinting(false)
    }
  }

  const refreshNFTs = () => {
    // Force refresh the NFT data
    if (lastMintedId) {
      generatePreview(lastMintedId)
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 glow-text">
        Mood NFT Collection
      </h3>
      
      <div className="space-y-4">
        {/* Error display */}
        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        {/* Transaction Info */}
        {lastTxHash && (
          <div className="text-xs bg-green-900/20 p-2 rounded border border-green-500">
            <div className="text-green-400 font-semibold mb-1">Last Transaction:</div>
            <div className="font-mono text-green-300 break-all">
              {lastTxHash}
            </div>
            <a 
              href={`https://sepolia.etherscan.io/tx/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline text-sm"
            >
              View on Sepolia Etherscan →
            </a>
          </div>
        )}

        {/* Current NFT Preview */}
        {previewImage ? (
          <div className="flex justify-center">
            <div className="w-48 h-48 rounded-lg overflow-hidden border-2 border-pink-400 shadow-lg">
              <img 
                src={previewImage} 
                alt="Mood NFT" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="w-48 h-48 mx-auto bg-gray-700 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-500">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">🎨</div>
              <p>Mint your first NFT!</p>
            </div>
          </div>
        )}

        {/* NFT Stats */}
        <div className="text-center">
          <p className="text-gray-400 mb-2">Your NFTs: {userNFTs.length}</p>
          {lastMintedId && (
            <p className="text-sm text-blue-400 mb-2">
              Last minted: #{lastMintedId}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={simulateMint}
            disabled={!account || isMinting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? 'Minting...' : 'Mint NFT'}
          </button>
          
          {lastMintedId && (
            <button
              onClick={refreshNFTs}
              className="btn-secondary w-full text-sm"
            >
              Refresh NFT Preview
            </button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center space-y-2">
          <div>Dynamic NFT that changes based on market conditions!</div>
          
          {lastTxHash && (
            <div className="bg-gray-800/50 p-2 rounded">
              <div className="text-yellow-400 mb-1">📋 Next Steps:</div>
              <div className="text-left space-y-1">
                <div>1. Click the Etherscan link above</div>
                <div>2. Check if transaction shows "Success"</div>
                <div>3. Look for "Transfer" event in transaction logs</div>
                <div>4. If successful, NFT should appear in your wallet</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}