'use client'

import { useState, useEffect } from 'react'
import { mintNFT, getNFTsForAddress, listenForTransferEvents } from '@/utils/web3'

interface BadgePreviewProps {
  account: string
}

export default function BadgePreview({ account }: BadgePreviewProps) {
  const [userNFTs, setUserNFTs] = useState<string[]>([])
  const [isMinting, setIsMinting] = useState(false)
  const [lastMintedId, setLastMintedId] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastTxHash, setLastTxHash] = useState('')

  // Load user's NFTs when account changes
  useEffect(() => {
    if (account) {
      fetchUserNFTs()
      
      // Listen for new transfers to this account
      const unsubscribe = listenForTransferEvents((event) => {
        if (event.to.toLowerCase() === account.toLowerCase()) {
          console.log('New NFT transfer detected:', event)
          setLastMintedId(event.tokenId)
          fetchUserNFTs()
        }
      });
      
      // Cleanup listener when component unmounts or account changes
      return unsubscribe
    }
  }, [account])

  // Generate preview when lastMintedId changes
  useEffect(() => {
    if (lastMintedId) {
      generatePreview(lastMintedId)
    }
  }, [lastMintedId])
  
  // Fetch user's NFTs
  const fetchUserNFTs = async () => {
    if (!account) return
    
    try {
      setLoading(true)
      const tokens = await getNFTsForAddress(account)
      setUserNFTs(tokens)
      
      // If user has tokens, show the last one
      if (tokens.length > 0) {
        const lastToken = tokens[tokens.length - 1]
        setLastMintedId(lastToken)
        generatePreview(lastToken)
      }
    } catch (error) {
      console.error('Error fetching NFTs:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePreview = async (tokenId: string) => {
    try {
      const response = await fetch(`/api/metadata/${tokenId}`)
      const metadata = await response.json()
      setPreviewImage(metadata.image)
    } catch (error) {
      console.error('Error generating preview:', error)
    }
  }

  const handleMint = async () => {
    if (!account) {
      alert('Please connect your wallet first!')
      return
    }

    setIsMinting(true)
    setError('')
    
    try {
      // Execute actual minting transaction
      const tx = await mintNFT()
      setLastTxHash(tx.hash)
      
      alert(`Transaction sent! Hash: ${tx.hash}`)
      
      // Wait for confirmation and get the tokenId
      const receipt = await tx.wait()
      setLastMintedId(receipt.tokenId)
      
      // Refresh the user's NFTs
      fetchUserNFTs()
      
    } catch (error: any) {
      console.error('Minting failed:', error)
      setError(`Minting failed: ${error.message || 'Unknown error'}`)
    } finally {
      setIsMinting(false)
    }
  }

  const refreshNFTs = () => {
    fetchUserNFTs()
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
            onClick={handleMint}
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
              Refresh NFT Collection
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
                <div>1. Wait for transaction confirmation</div>
                <div>2. Your NFT will appear in your wallet</div>
                <div>3. NFT appearance changes with market conditions</div>
                <div>4. Check Etherscan for transaction details</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}