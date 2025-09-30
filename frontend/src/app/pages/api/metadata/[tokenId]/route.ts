export async function GET(request: Request, { params }: { params: { tokenId: string } }) {
  const { tokenId } = params

  try {
    // Generate varied mood and visual characteristics
    const seed = parseInt(tokenId) + Math.floor(Date.now() / 30000)
    const random = (s: number) => Math.abs(Math.sin(s * 12.9898 + 78.233) * 43758.5453) % 1

    // More diverse moods and visual styles
    const moods = [
      { 
        name: 'Diamond Hands', 
        color: '#00ffff', 
        bg: '#001a1a',
        energy: 'Legendary', 
        emoji: '💎',
        pattern: 'diamonds',
        rarity: 'Legendary'
      },
      { 
        name: 'Bull Run', 
        color: '#39ff14', 
        bg: '#0a2e0a',
        energy: 'Extreme', 
        emoji: '🚀',
        pattern: 'rockets',
        rarity: 'Epic'
      },
      { 
        name: 'Bear Market', 
        color: '#ff4444', 
        bg: '#2e0a0a',
        energy: 'Crushing', 
        emoji: '🐻',
        pattern: 'storm',
        rarity: 'Common'
      },
      { 
        name: 'Crab Sideways', 
        color: '#ffaa00', 
        bg: '#2e1a00',
        energy: 'Neutral', 
        emoji: '🦀',
        pattern: 'waves',
        rarity: 'Uncommon'
      },
      { 
        name: 'Moon Mission', 
        color: '#ff10f0', 
        bg: '#1a001a',
        energy: 'Cosmic', 
        emoji: '🌙',
        pattern: 'stars',
        rarity: 'Rare'
      },
      { 
        name: 'Degen Mode', 
        color: '#ff6600', 
        bg: '#2e1100',
        energy: 'Chaos', 
        emoji: '🎲',
        pattern: 'chaos',
        rarity: 'Epic'
      },
      { 
        name: 'HODL Strong', 
        color: '#6600ff', 
        bg: '#110025',
        energy: 'Zen', 
        emoji: '🧘',
        pattern: 'zen',
        rarity: 'Rare'
      },
      { 
        name: 'Ape Together', 
        color: '#ff9900', 
        bg: '#2e1700',
        energy: 'Unity', 
        emoji: '🦍',
        pattern: 'tribal',
        rarity: 'Uncommon'
      }
    ]
    
    const moodIndex = Math.floor(random(seed) * moods.length)
    const mood = moods[moodIndex]

    // Generate unique visual elements
    const hasGlow = random(seed + 1) > 0.3
    const hasParticles = random(seed + 2) > 0.5
    const hasPattern = random(seed + 3) > 0.4
    const frameStyle = Math.floor(random(seed + 4) * 4)

    // Create complex SVG with multiple visual elements
    const svg = generateComplexSVG(mood, tokenId, { hasGlow, hasParticles, hasPattern, frameStyle, seed })
    
    // Enhanced metadata
    const metadata = {
      name: `${mood.name} Mood #${tokenId}`,
      description: `A dynamic NFT capturing the essence of ${mood.name.toLowerCase()}. This NFT's appearance reflects real-time market sentiment and evolves with blockchain conditions. Rarity: ${mood.rarity}`,
      image: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      attributes: [
        {
          trait_type: "Mood",
          value: mood.name
        },
        {
          trait_type: "Rarity",
          value: mood.rarity
        },
        {
          trait_type: "Energy Level",
          value: mood.energy
        },
        {
          trait_type: "Primary Color",
          value: mood.color
        },
        {
          trait_type: "Has Glow Effect",
          value: hasGlow ? "Yes" : "No"
        },
        {
          trait_type: "Particle System",
          value: hasParticles ? "Active" : "None"
        },
        {
          trait_type: "Background Pattern",
          value: hasPattern ? mood.pattern : "Solid"
        },
        {
          trait_type: "Frame Style",
          value: `Style ${frameStyle + 1}`
        },
        {
          trait_type: "Generation",
          value: new Date().toISOString().split('T')[0]
        }
      ]
    }

    return Response.json(metadata)
  } catch (error) {
    console.error('Error generating metadata:', error)
    return Response.json({ error: 'Failed to generate metadata' }, { status: 500 })
  }
}

function generateComplexSVG(mood: any, tokenId: string, effects: any) {
  const { hasGlow, hasParticles, hasPattern, frameStyle, seed } = effects
  const random = (s: number) => Math.abs(Math.sin(s * 12.9898 + 78.233) * 43758.5453) % 1

  // Generate background pattern
  let backgroundPattern = ''
  if (hasPattern) {
    switch (mood.pattern) {
      case 'diamonds':
        backgroundPattern = generateDiamondPattern(mood.color)
        break
      case 'rockets':
        backgroundPattern = generateRocketPattern(mood.color)
        break
      case 'storm':
        backgroundPattern = generateStormPattern(mood.color)
        break
      case 'waves':
        backgroundPattern = generateWavePattern(mood.color)
        break
      case 'stars':
        backgroundPattern = generateStarPattern(mood.color)
        break
      case 'chaos':
        backgroundPattern = generateChaosPattern(mood.color)
        break
      case 'zen':
        backgroundPattern = generateZenPattern(mood.color)
        break
      case 'tribal':
        backgroundPattern = generateTribalPattern(mood.color)
        break
    }
  }

  // Generate particle system
  let particles = ''
  if (hasParticles) {
    particles = generateParticles(mood.color, seed)
  }

  // Generate frame
  const frame = generateFrame(frameStyle, mood.color)

  return `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${mood.color};stop-opacity:0.3" />
        <stop offset="50%" style="stop-color:${mood.bg};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
      </linearGradient>
      <radialGradient id="centerGlow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" style="stop-color:${mood.color};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:transparent;stop-opacity:0" />
      </radialGradient>
      ${hasGlow ? `
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      ` : ''}
    </defs>
    
    <!-- Background -->
    <rect width="400" height="400" fill="url(#bg)" />
    <rect width="400" height="400" fill="url(#centerGlow)" />
    
    <!-- Background Pattern -->
    ${backgroundPattern}
    
    <!-- Main Circle -->
    <circle cx="200" cy="160" r="90" fill="none" stroke="${mood.color}" stroke-width="3" opacity="0.6">
      <animate attributeName="r" values="85;95;85" dur="4s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Inner Power Circle -->
    <circle cx="200" cy="160" r="60" fill="none" stroke="${mood.color}" stroke-width="2" opacity="0.8" ${hasGlow ? 'filter="url(#glow)"' : ''}>
      <animate attributeName="r" values="55;65;55" dur="3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Main Emoji -->
    <text x="200" y="175" font-family="Arial, sans-serif" font-size="70" text-anchor="middle" ${hasGlow ? 'filter="url(#strongGlow)"' : ''}>
      ${mood.emoji}
    </text>
    
    <!-- Token ID -->
    <text x="200" y="290" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="white">
      #${tokenId}
    </text>
    
    <!-- Mood Name -->
    <text x="200" y="320" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="${mood.color}" ${hasGlow ? 'filter="url(#glow)"' : ''}>
      ${mood.name.toUpperCase()}
    </text>
    
    <!-- Rarity Badge -->
    <rect x="20" y="20" width="80" height="25" rx="12" fill="${mood.color}" opacity="0.8"/>
    <text x="60" y="37" font-family="Arial, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" fill="black">
      ${mood.rarity.toUpperCase()}
    </text>
    
    <!-- Energy Level -->
    <text x="200" y="350" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="#cccccc">
      Energy: ${mood.energy}
    </text>
    
    <!-- Particles -->
    ${particles}
    
    <!-- Frame -->
    ${frame}
  </svg>`
}

function generateDiamondPattern(color: string) {
  return `
    <g opacity="0.1">
      <polygon points="50,50 75,75 50,100 25,75" fill="${color}"/>
      <polygon points="150,30 175,55 150,80 125,55" fill="${color}"/>
      <polygon points="250,70 275,95 250,120 225,95" fill="${color}"/>
      <polygon points="350,40 375,65 350,90 325,65" fill="${color}"/>
    </g>
  `
}

function generateRocketPattern(color: string) {
  return `
    <g opacity="0.15">
      <path d="M30,80 L50,60 L45,40 L35,45 L25,45 Z" fill="${color}"/>
      <path d="M370,120 L350,100 L355,80 L365,85 L375,85 Z" fill="${color}"/>
      <circle cx="100" cy="300" r="3" fill="${color}">
        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>
  `
}

function generateStormPattern(color: string) {
  return `
    <g opacity="0.2">
      <path d="M20,60 Q50,40 80,60 Q110,80 140,60" stroke="${color}" stroke-width="2" fill="none"/>
      <path d="M260,100 Q290,80 320,100 Q350,120 380,100" stroke="${color}" stroke-width="2" fill="none"/>
      <circle cx="150" cy="300" r="2" fill="${color}">
        <animate attributeName="cy" values="300;280;300" dur="3s" repeatCount="indefinite"/>
      </circle>
    </g>
  `
}

function generateWavePattern(color: string) {
  return `
    <g opacity="0.15">
      <path d="M0,200 Q100,180 200,200 Q300,220 400,200" stroke="${color}" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M0,220 Q100,200 200,220 Q300,240 400,220" stroke="${color}" stroke-width="1" fill="none" opacity="0.3"/>
    </g>
  `
}

function generateStarPattern(color: string) {
  return `
    <g opacity="0.2">
      <circle cx="80" cy="80" r="2" fill="${color}">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="320" cy="120" r="1.5" fill="${color}">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="4s" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="300" r="2.5" fill="${color}">
        <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite"/>
      </circle>
    </g>
  `
}

function generateChaosPattern(color: string) {
  return `
    <g opacity="0.15">
      <line x1="50" y1="50" x2="150" y2="80" stroke="${color}" stroke-width="1"/>
      <line x1="250" y1="40" x2="350" y2="120" stroke="${color}" stroke-width="1"/>
      <line x1="80" y1="300" x2="320" y2="280" stroke="${color}" stroke-width="1"/>
    </g>
  `
}

function generateZenPattern(color: string) {
  return `
    <g opacity="0.1">
      <circle cx="200" cy="200" r="150" fill="none" stroke="${color}" stroke-width="1"/>
      <circle cx="200" cy="200" r="100" fill="none" stroke="${color}" stroke-width="1"/>
      <circle cx="200" cy="200" r="50" fill="none" stroke="${color}" stroke-width="1"/>
    </g>
  `
}

function generateTribalPattern(color: string) {
  return `
    <g opacity="0.2">
      <path d="M50,50 L70,30 L90,50 L70,70 Z" fill="${color}"/>
      <path d="M350,350 L330,330 L350,310 L370,330 Z" fill="${color}"/>
    </g>
  `
}

function generateParticles(color: string, seed: number) {
  let particles = ''
  for (let i = 0; i < 12; i++) {
    const random = (s: number) => Math.abs(Math.sin(s * 12.9898 + 78.233) * 43758.5453) % 1
    const x = 50 + random(seed + i) * 300
    const y = 50 + random(seed + i + 100) * 300
    const size = 1 + random(seed + i + 200) * 3
    const duration = 2 + random(seed + i + 300) * 4
    
    particles += `
      <circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="0.4">
        <animate attributeName="cy" values="${y};${y - 50};${y}" dur="${duration}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="${duration}s" repeatCount="indefinite"/>
      </circle>
    `
  }
  return `<g>${particles}</g>`
}

function generateFrame(style: number, color: string) {
  switch (style) {
    case 0: // Classic border
      return `<rect x="5" y="5" width="390" height="390" fill="none" stroke="${color}" stroke-width="2" opacity="0.6"/>`
    case 1: // Double border
      return `
        <rect x="5" y="5" width="390" height="390" fill="none" stroke="${color}" stroke-width="1" opacity="0.4"/>
        <rect x="15" y="15" width="370" height="370" fill="none" stroke="${color}" stroke-width="1" opacity="0.6"/>
      `
    case 2: // Dashed border
      return `<rect x="5" y="5" width="390" height="390" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="10,5" opacity="0.6"/>`
    case 3: // Corner accents
      return `
        <g stroke="${color}" stroke-width="3" fill="none" opacity="0.8">
          <path d="M5,25 L5,5 L25,5"/>
          <path d="M375,5 L395,5 L395,25"/>
          <path d="M395,375 L395,395 L375,395"/>
          <path d="M25,395 L5,395 L5,375"/>
        </g>
      `
    default:
      return ''
  }
}