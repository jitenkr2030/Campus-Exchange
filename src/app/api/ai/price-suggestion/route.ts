import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Mock AI price suggestion logic
const getPriceSuggestion = (title: string, category: string, description?: string): number => {
  const titleLower = title.toLowerCase()
  const descLower = description?.toLowerCase() || ''
  
  // Base prices by category
  const basePrices: { [key: string]: number } = {
    'NOTES': 150,
    'BOOKS': 400,
    'BIKES': 3000,
    'FOOD_TOKENS': 50,
    'ROOM_RENTALS': 5000
  }
  
  let basePrice = basePrices[category] || 100
  
  // Adjust based on keywords
  const priceModifiers: { [key: string]: number } = {
    // Notes modifiers
    'handwritten': 0.8,
    'pdf': 1.2,
    'scanned': 0.9,
    'typed': 1.1,
    'color': 1.3,
    'diagrams': 1.2,
    'solutions': 1.4,
    'previous year': 1.5,
    'question paper': 1.3,
    'guide': 1.2,
    
    // Books modifiers
    'new': 1.5,
    'like new': 1.3,
    'good condition': 1.0,
    'fair': 0.7,
    'textbook': 1.2,
    'reference': 1.1,
    'competitive': 1.4,
    'exam': 1.3,
    'solutions': 1.2,
    'latest edition': 1.5,
    'old edition': 0.6,
    
    // Bikes modifiers
    'new': 1.8,
    'excellent': 1.5,
    'good condition': 1.2,
    'electric': 1.6,
    'gear': 1.1,
    'brake': 0.9,
    'tire': 0.9,
    'maintenance': 0.8,
    'hero': 1.0,
    'atlas': 1.1,
    'brompton': 2.0,
    
    // Food tokens modifiers
    'weekly': 1.2,
    'monthly': 1.5,
    'bulk': 0.8,
    'mess': 1.0,
    'canteen': 1.1,
    'cafeteria': 1.1,
    
    // Room rentals modifiers
    'ac': 1.5,
    'furnished': 1.4,
    'shared': 0.7,
    'single': 1.3,
    'attached bath': 1.3,
    'balcony': 1.1,
    'parking': 1.2,
    'near campus': 1.3,
    'pg': 1.1,
    'hostel': 0.9
  }
  
  // Apply modifiers
  let finalPrice = basePrice
  let modifierCount = 0
  
  Object.entries(priceModifiers).forEach(([keyword, modifier]) => {
    if (titleLower.includes(keyword) || descLower.includes(keyword)) {
      finalPrice *= modifier
      modifierCount++
    }
  })
  
  // Add some randomness to make it feel more AI-like
  const randomFactor = 0.9 + Math.random() * 0.2 // 0.9 to 1.1
  finalPrice *= randomFactor
  
  // Round to nearest 10 for cleaner prices
  finalPrice = Math.round(finalPrice / 10) * 10
  
  // Ensure minimum price
  const minPrices: { [key: string]: number } = {
    'NOTES': 50,
    'BOOKS': 100,
    'BIKES': 500,
    'FOOD_TOKENS': 20,
    'ROOM_RENTALS': 1000
  }
  
  finalPrice = Math.max(finalPrice, minPrices[category] || 10)
  
  return Math.round(finalPrice)
}

export async function POST(request: NextRequest) {
  try {
    const { title, category, description } = await request.json()

    if (!title || !category) {
      return NextResponse.json(
        { success: false, message: 'Title and category are required' },
        { status: 400 }
      )
    }

    // Get AI price suggestion
    const suggestedPrice = getPriceSuggestion(title, category, description)
    
    // Get price range based on similar listings
    const similarListings = await db.listing.findMany({
      where: {
        category: category,
        isAvailable: true
      },
      select: {
        price: true
      },
      take: 50,
      orderBy: { createdAt: 'desc' }
    })

    let priceRange = { min: suggestedPrice * 0.7, max: suggestedPrice * 1.3, average: suggestedPrice }
    
    if (similarListings.length > 0) {
      const prices = similarListings.map(l => l.price)
      const min = Math.min(...prices)
      const max = Math.max(...prices)
      const avg = prices.reduce((a, b) => a + b, 0) / prices.length
      
      priceRange = {
        min: Math.round(min),
        max: Math.round(max),
        average: Math.round(avg)
      }
    }

    // Generate confidence score based on data availability
    const confidence = similarListings.length > 10 ? 0.9 : 
                       similarListings.length > 5 ? 0.7 :
                       similarListings.length > 0 ? 0.5 : 0.3

    // Generate reasoning
    const reasoning = generateReasoning(title, category, description, suggestedPrice, priceRange)

    return NextResponse.json({
      success: true,
      suggestion: {
        price: suggestedPrice,
        range: priceRange,
        confidence: Math.round(confidence * 100),
        reasoning,
        similarListingsCount: similarListings.length
      }
    })

  } catch (error) {
    console.error('Price suggestion error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateReasoning(title: string, category: string, description: string | undefined, suggestedPrice: number, priceRange: { min: number; max: number; average: number }): string {
  const reasons: string[] = []
  
  // Category-based reasoning
  reasons.push(`Based on ${category.toLowerCase()} pricing trends`)
  
  // Title analysis
  const titleLower = title.toLowerCase()
  if (titleLower.includes('new') || titleLower.includes('excellent')) {
    reasons.push('Item condition appears to be excellent')
  }
  if (titleLower.includes('old') || titleLower.includes('used')) {
    reasons.push('Item shows signs of use')
  }
  
  // Description analysis
  if (description) {
    const descLower = description.toLowerCase()
    if (descLower.includes('rare') || descLower.includes('limited')) {
      reasons.push('Item appears to be rare or limited edition')
    }
    if (descLower.includes('urgent') || descLower.includes('quick')) {
      reasons.push('Seller indicates urgency, may affect pricing')
    }
  }
  
  // Market comparison
  if (priceRange.average > 0) {
    if (suggestedPrice > priceRange.average * 1.1) {
      reasons.push('Priced above market average due to perceived higher value')
    } else if (suggestedPrice < priceRange.average * 0.9) {
      reasons.push('Priced below market average for quick sale')
    } else {
      reasons.push('Priced competitively within market range')
    }
  }
  
  return reasons.join('. ') + '.'
}