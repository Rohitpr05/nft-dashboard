'use client'

import { useState, useEffect } from 'react'

interface BadgePreviewProps {
  account: string
}

export default function BadgePreview({ account }: BadgePreviewProps) {
  const [nftCount, setNftCount] = useState(0)
  const [isMinting, setIsMinting] = useState(false)
  const [lastMintedId, setLastMintedId] = useState<number | null>(null)
  const [previewImage, setPreviewImage] = useState('')

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

  const mintNFT = async () => {
    if (!account) {
      alert('Please connect your wallet first!')
      return
    }

    setIsMinting(true)
    try {
      // For now, simulate minting without actual contract interaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      const newTokenId = nftCount + 1
      setLastMintedId(newTokenId)
      setNftCount(newTokenId)
      alert(`Successfully minted NFT #${newTokenId}! 🎉`)
    } catch (error) {
      console.error('Error minting NFT:', error)
      alert('Error minting NFT!')
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 glow-text">
        Mood NFT Badge
      </h3>
      
      <div className="space-y-4">
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
              <p>Mint your first Mood NFT!</p>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-gray-400 mb-2">Your NFTs: {nftCount}</p>
          {lastMintedId && (
            <p className="text-sm text-blue-400 mb-4">
              Last minted: #{lastMintedId}
            </p>
          )}
          
          <button
            onClick={mintNFT}
            disabled={!account || isMinting}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMinting ? 'Minting...' : 'Mint Mood NFT'}
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Dynamic NFT that changes based on market conditions!
        </div>
      </div>
    </div>
  )
}