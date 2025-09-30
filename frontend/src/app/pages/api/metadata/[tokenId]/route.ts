export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
  const { tokenId } = params

  try {
    // Simulate market mood based on current time
    const now = Date.now()
    const moodIndex = Math.floor(now / 10000) % 3 // Changes every 10 seconds
    
    const moods = [
      { name: 'Bullish', color: '#39ff14', energy: 'High', emoji: '🚀' },
      { name: 'Bearish', color: '#ff4444', energy: 'Low', emoji: '😰' },
      { name: 'Neutral', color: '#00f5ff', energy: 'Medium', emoji: '😎' }
    ]
    
    const mood = moods[moodIndex]
    
    // Generate simple SVG
    const svg = `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${mood.color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:0.9" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#bg)" />
      <circle cx="200" cy="150" r="80" fill="none" stroke="${mood.color}" stroke-width="4" />
      <text x="200" y="165" font-family="Arial" font-size="60" text-anchor="middle" fill="${mood.color}">${mood.emoji}</text>
      <text x="200" y="280" font-family="Arial" font-size="24" font-weight="bold" text-anchor="middle" fill="white">#${tokenId}</text>
      <text x="200" y="310" font-family="Arial" font-size="28" font-weight="bold" text-anchor="middle" fill="${mood.color}">${mood.name.toUpperCase()}</text>
      <text x="200" y="340" font-family="Arial" font-size="16" text-anchor="middle" fill="#cccccc">Energy: ${mood.energy}</text>
    </svg>`
    
    const metadata = {
      name: `Mood NFT #${tokenId}`,
      description: `A dynamic NFT reflecting current market mood: ${mood.name}`,
      image: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      attributes: [
        { trait_type: "Mood", value: mood.name },
        { trait_type: "Color", value: mood.color },
        { trait_type: "Energy Level", value: mood.energy },
        { trait_type: "Generated At", value: new Date().toISOString() }
      ]
    }

    return Response.json(metadata)
  } catch (error) {
    console.error('API Error:', error)
    return Response.json({ error: 'Failed to generate metadata' }, { status: 500 })
  }
}