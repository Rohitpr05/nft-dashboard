export default async function handler(req, res) {
  const { tokenId } = req.query

  try {
    // Get market data to determine mood
    const mood = await getMoodData()
    
    // Generate SVG based on mood
    const svgImage = generateMoodSVG(mood, tokenId)
    
    // Create metadata
    const metadata = {
      name: `Mood NFT #${tokenId}`,
      description: `A dynamic NFT that reflects the current market mood. Current mood: ${mood.name}`,
      image: svgImage,
      attributes: [
        {
          trait_type: "Mood",
          value: mood.name
        },
        {
          trait_type: "Color",
          value: mood.color
        },
        {
          trait_type: "Energy Level",
          value: mood.energy
        },
        {
          trait_type: "Generated At",
          value: new Date().toISOString()
        }
      ]
    }

    res.status(200).json(metadata)
  } catch (error) {
    console.error('Error generating metadata:', error)
    res.status(500).json({ error: 'Failed to generate metadata' })
  }
}

async function getMoodData() {
  try {
    // In production, fetch real market data from Alchemy or CoinGecko
    // For demo, we'll simulate market conditions
    const ethPrice = 2000 + Math.random() * 500
    const gasPrice = 20 + Math.random() * 30
    
    // Determine mood based on simulated conditions
    if (ethPrice > 2300 && gasPrice < 25) {
      return { name: 'Bullish', color: '#39ff14', energy: 'High', emoji: '🚀' }
    } else if (ethPrice < 2100 || gasPrice > 40) {
      return { name: 'Bearish', color: '#ff4444', energy: 'Low', emoji: '😰' }
    } else {
      return { name: 'Neutral', color: '#00f5ff', energy: 'Medium', emoji: '😎' }
    }
  } catch (error) {
    // Fallback mood
    return { name: 'Mysterious', color: '#bf00ff', energy: 'Unknown', emoji: '🔮' }
  }
}

function generateMoodSVG(mood, tokenId) {
  const svg = `
    <svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${mood.color};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:0.9" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="400" height="400" fill="url(#bg)" />
      
      <!-- Mood Circle -->
      <circle cx="200" cy="150" r="80" fill="none" stroke="${mood.color}" stroke-width="4" filter="url(#glow)">
        <animate attributeName="r" values="75;85;75" dur="3s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Mood Emoji -->
      <text x="200" y="165" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" fill="${mood.color}">
        ${mood.emoji}
      </text>
      
      <!-- Token ID -->
      <text x="200" y="280" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="white">
        #${tokenId}
      </text>
      
      <!-- Mood Name -->
      <text x="200" y="310" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="${mood.color}" filter="url(#glow)">
        ${mood.name.toUpperCase()}
      </text>
      
      <!-- Energy Level -->
      <text x="200" y="340" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#cccccc">
        Energy: ${mood.energy}
      </text>
      
      <!-- Animated particles -->
      <circle cx="100" cy="100" r="2" fill="${mood.color}" opacity="0.6">
        <animate attributeName="cy" values="100;300;100" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="300" cy="120" r="2" fill="${mood.color}" opacity="0.6">
        <animate attributeName="cy" values="120;320;120" dur="5s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.6;0.1;0.6" dur="5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}