import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Mock AI fraud detection logic
const analyzeFraudRisk = (listingData: {
  title: string
  description?: string
  price: number
  category: string
  userId: string
}): { riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'; riskScore: number; flags: string[]; reasoning: string } => {
  const flags: string[] = []
  let riskScore = 0
  
  const titleLower = listingData.title.toLowerCase()
  const descLower = listingData.description?.toLowerCase() || ''
  const text = titleLower + ' ' + descLower
  
  // Price analysis
  const categoryPriceRanges: { [key: string]: { min: number; max: number; outlier: number } } = {
    'NOTES': { min: 50, max: 500, outlier: 1000 },
    'BOOKS': { min: 100, max: 2000, outlier: 5000 },
    'BIKES': { min: 500, max: 10000, outlier: 20000 },
    'FOOD_TOKENS': { min: 20, max: 200, outlier: 500 },
    'ROOM_RENTALS': { min: 1000, max: 15000, outlier: 30000 }
  }
  
  const priceRange = categoryPriceRanges[listingData.category]
  if (priceRange) {
    if (listingData.price > priceRange.outlier) {
      flags.push('Price significantly above market range')
      riskScore += 30
    } else if (listingData.price < priceRange.min) {
      flags.push('Price suspiciously low')
      riskScore += 20
    }
  }
  
  // Title and description analysis
  const suspiciousPatterns = [
    /urgent/i,
    /quick sale/i,
    /emergency/i,
    /limited time/i,
    /act fast/i,
    /too good to be true/i,
    /unbelievable/i,
    /incredible deal/i,
    /once in lifetime/i,
    /discount.*\d{2,3}%/i,
    /cheap/i,
    /free/i,
    /giveaway/i,
    /prize/i,
    /winner/i,
    /congratulations/i,
    /you.*won/i,
    /click.*here/i,
    /contact.*immediately/i,
    /only.*today/i,
    /expires.*soon/i
  ]
  
  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      flags.push(`Suspicious pattern detected: ${pattern.source}`)
      riskScore += 15
    }
  })
  
  // Contact information in description
  const contactPatterns = [
    /\b\d{10}\b/g, // Phone numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
    /whatsapp/i,
    /call me/i,
    /contact.*number/i,
    /phone.*number/i,
    /mobile.*number/i,
    /telegram/i,
    /signal/i,
    /outside.*platform/i,
    /direct.*contact/i
  ]
  
  contactPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      flags.push('External contact information detected')
      riskScore += 25
    }
  })
  
  // Financial requests
  const financialPatterns = [
    /advance.*payment/i,
    /pay.*first/i,
    /deposit.*required/i,
    /security.*deposit/i,
    /transfer.*money/i,
    /bank.*transfer/i,
    /upi.*payment/i,
    /paytm/i,
    /google.*pay/i,
    /phone.*pay/i,
    /crypto/i,
    /bitcoin/i,
    /investment/i,
    /return.*guarantee/i,
    /money.*back/i
  ]
  
  financialPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      flags.push('Suspicious financial request detected')
      riskScore += 40
    }
  })
  
  // Length analysis
  if (listingData.description && listingData.description.length < 20) {
    flags.push('Description too short')
    riskScore += 10
  }
  
  if (listingData.description && listingData.description.length > 2000) {
    flags.push('Description unusually long')
    riskScore += 5
  }
  
  // Repetitive content
  const words = text.split(/\s+/)
  const wordFreq: { [key: string]: number } = {}
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  const repetitiveWords = Object.entries(wordFreq).filter(([word, freq]) => freq > 3 && word.length > 3)
  if (repetitiveWords.length > 2) {
    flags.push('Repetitive content detected')
    riskScore += 10
  }
  
  // All caps usage
  const capsRatio = (titleLower.match(/[A-Z]/g) || []).length / titleLower.length
  if (capsRatio > 0.3) {
    flags.push('Excessive use of capital letters')
    riskScore += 15
  }
  
  // Special characters and symbols
  const specialCharRatio = (text.match(/[^a-zA-Z0-9\s]/g) || []).length / text.length
  if (specialCharRatio > 0.2) {
    flags.push('Excessive use of special characters')
    riskScore += 10
  }
  
  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW'
  if (riskScore >= 70) {
    riskLevel = 'HIGH'
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM'
  }
  
  // Generate reasoning
  const reasoning = generateFraudReasoning(flags, riskScore, riskLevel)
  
  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    flags,
    reasoning
  }
}

function generateFraudReasoning(flags: string[], riskScore: number, riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  if (flags.length === 0) {
    return 'No suspicious patterns detected. Listing appears to be legitimate.'
  }
  
  let reasoning = `Detected ${flags.length} suspicious indicator${flags.length > 1 ? 's' : ''}: `
  
  // Group flags by severity
  const highSeverityFlags = flags.filter(f => 
    f.includes('Price') || f.includes('financial') || f.includes('contact')
  )
  const mediumSeverityFlags = flags.filter(f => 
    f.includes('pattern') || f.includes('capital') || f.includes('special')
  )
  const lowSeverityFlags = flags.filter(f => 
    f.includes('short') || f.includes('long') || f.includes('repetitive')
  )
  
  if (highSeverityFlags.length > 0) {
    reasoning += `High-risk indicators: ${highSeverityFlags.join(', ').toLowerCase()}. `
  }
  
  if (mediumSeverityFlags.length > 0) {
    reasoning += `Medium-risk indicators: ${mediumSeverityFlags.join(', ').toLowerCase()}. `
  }
  
  if (lowSeverityFlags.length > 0) {
    reasoning += `Low-risk indicators: ${lowSeverityFlags.join(', ').toLowerCase()}. `
  }
  
  reasoning += `Overall risk score: ${riskScore}/100. `
  
  if (riskLevel === 'HIGH') {
    reasoning += 'This listing shows strong indicators of potential fraud. Manual review recommended.'
  } else if (riskLevel === 'MEDIUM') {
    reasoning += 'This listing shows some suspicious patterns. Additional verification may be needed.'
  } else {
    reasoning += 'This listing has minor suspicious patterns but appears mostly legitimate.'
  }
  
  return reasoning
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, price, category, userId } = await request.json()

    if (!title || !price || !category || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get AI fraud detection
    const fraudAnalysis = analyzeFraudRisk({
      title,
      description,
      price: parseFloat(price),
      category,
      userId
    })
    
    // Check user's history for additional risk factors
    const userHistory = await db.user.findUnique({
      where: { id: userId },
      include: {
        listings: {
          select: {
            id: true,
            createdAt: true,
            reports: true
          }
        },
        receivedReviews: {
          select: {
            rating: true,
            comment: true
          }
        }
      }
    })
    
    let additionalFlags: string[] = []
    let additionalRiskScore = 0
    
    if (userHistory) {
      // Check for new users (potential throwaway accounts)
      const userAge = Date.now() - new Date(userHistory.createdAt).getTime()
      const daysOld = userAge / (1000 * 60 * 60 * 24)
      
      if (daysOld < 7) {
        additionalFlags.push('Account created recently')
        additionalRiskScore += 10
      }
      
      // Check for high listing frequency
      const recentListings = userHistory.listings.filter(
        listing => Date.now() - new Date(listing.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
      )
      
      if (recentListings.length > 5) {
        additionalFlags.push('High listing frequency')
        additionalRiskScore += 15
      }
      
      // Check for reports on user's listings
      const totalReports = userHistory.listings.reduce(
        (sum, listing) => sum + (listing.reports?.length || 0),
        0
      )
      
      if (totalReports > 3) {
        additionalFlags.push('Multiple reports on user listings')
        additionalRiskScore += 20
      }
      
      // Check for low ratings
      const avgRating = userHistory.receivedReviews.length > 0
        ? userHistory.receivedReviews.reduce((sum, review) => sum + review.rating, 0) / userHistory.receivedReviews.length
        : 5
      
      if (avgRating < 2.5) {
        additionalFlags.push('Low average rating from other users')
        additionalRiskScore += 15
      }
    }
    
    // Combine scores
    const finalRiskScore = Math.min(fraudAnalysis.riskScore + additionalRiskScore, 100)
    let finalRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = fraudAnalysis.riskLevel
    
    if (finalRiskScore >= 70) {
      finalRiskLevel = 'HIGH'
    } else if (finalRiskScore >= 40) {
      finalRiskLevel = 'MEDIUM'
    }
    
    const allFlags = [...fraudAnalysis.flags, ...additionalFlags]
    const finalReasoning = generateFinalFraudReasoning(
      fraudAnalysis.reasoning,
      additionalFlags,
      additionalRiskScore,
      finalRiskLevel
    )

    return NextResponse.json({
      success: true,
      fraudAnalysis: {
        riskLevel: finalRiskLevel,
        riskScore: finalRiskScore,
        flags: allFlags,
        reasoning: finalReasoning,
        recommendation: getRecommendation(finalRiskLevel, allFlags)
      }
    })

  } catch (error) {
    console.error('Fraud detection error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateFinalFraudReasoning(
  baseReasoning: string,
  additionalFlags: string[],
  additionalRiskScore: number,
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
): string {
  let reasoning = baseReasoning
  
  if (additionalFlags.length > 0) {
    reasoning += ` Additional user behavior indicators: ${additionalFlags.join(', ').toLowerCase()}. `
  }
  
  if (additionalRiskScore > 0) {
    reasoning += `Additional risk score from user behavior: ${additionalRiskScore}. `
  }
  
  return reasoning
}

function getRecommendation(riskLevel: 'LOW' | 'MEDIUM' | 'HIGH', flags: string[]): string {
  if (riskLevel === 'HIGH') {
    if (flags.some(f => f.includes('financial') || f.includes('contact'))) {
      return 'Immediate action required. Consider blocking the user and reporting the listing.'
    }
    return 'Manual review strongly recommended. Verify user identity and listing details before approval.'
  }
  
  if (riskLevel === 'MEDIUM') {
    if (flags.some(f => f.includes('contact'))) {
      return 'Review contact information policies. Consider removing external contact details.'
    }
    return 'Additional verification recommended. Check user history and validate listing claims.'
  }
  
  return 'Listing appears legitimate. Standard approval process can be followed.'
}