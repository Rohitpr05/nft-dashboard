export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
  const { tokenId } = params

  try {
    // Simulate market mood
    const mood = {
      name: 'Bullish',
      color: '#39ff14', 
      energy: 'High',
      emoji: '🚀'
    }
    
    const metadata = {
      name: `Mood NFT #${tokenId}`,
      description: `A dynamic NFT reflecting market mood: ${mood.name}`,
      image: `data:image/svg+xml;utf8,<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="400" fill="black"/><text x="200" y="200" fill="${mood.color}" text-anchor="middle" font-size="60">${mood.emoji}</text></svg>`,
      attributes: [
        { trait_type: "Mood", value: mood.name },
        { trait_type: "Energy", value: mood.energy }
      ]
    }

    return Response.json(metadata)
  } catch (error) {
    return Response.json({ error: 'Failed to generate metadata' }, { status: 500 })
  }
}