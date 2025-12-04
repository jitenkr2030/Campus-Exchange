import { NextRequest, NextResponse } from 'next/server'

// Mock AI category detection logic
const detectCategory = (title: string, description?: string): { category: string; confidence: number; reasoning: string } => {
  const text = (title + ' ' + (description || '')).toLowerCase()
  
  // Category keywords and their weights
  const categoryKeywords: { [key: string]: { keywords: string[]; weights: number[] } } = {
    'NOTES': {
      keywords: ['notes', 'note', 'handwritten', 'pdf', 'study material', 'lecture', 'class notes', 'exam notes', 'revision', 'guide', 'solution', 'question paper', 'previous year', 'semester', 'subject'],
      weights: [3, 3, 4, 3, 2, 2, 3, 3, 2, 2, 3, 4, 3, 2, 2]
    },
    'BOOKS': {
      keywords: ['book', 'textbook', 'reference', 'novel', 'guide', 'manual', 'handbook', 'workbook', 'study guide', 'competitive exam', 'entrance', 'publication', 'author', 'edition', 'chapter'],
      weights: [4, 4, 3, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 3, 2]
    },
    'BIKES': {
      keywords: ['bike', 'bicycle', 'cycle', 'scooter', 'electric', 'e-cycle', 'motorcycle', 'vehicle', 'two wheeler', 'gear', 'brake', 'tire', 'hero', 'atlas', 'brompton', 'ride', 'commute'],
      weights: [4, 4, 4, 3, 3, 3, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2]
    },
    'FOOD_TOKENS': {
      keywords: ['token', 'mess', 'canteen', 'cafeteria', 'food', 'meal', 'lunch', 'dinner', 'breakfast', 'coupon', 'credit', 'weekly', 'monthly', 'bulk', 'hostel', 'mess food'],
      weights: [4, 3, 3, 3, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2]
    },
    'ROOM_RENTALS': {
      keywords: ['room', 'rent', 'pg', 'paying guest', 'hostel', 'accommodation', 'flat', 'apartment', 'house', 'sharing', 'single', 'double', 'furnished', 'unfurnished', 'ac', 'non-ac', 'bathroom', 'balcony'],
      weights: [4, 4, 3, 3, 3, 3, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2]
    }
  }
  
  // Calculate scores for each category
  const scores: { [key: string]: number } = {}
  
  Object.entries(categoryKeywords).forEach(([category, data]) => {
    let score = 0
    data.keywords.forEach((keyword, index) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) {
        score += matches.length * data.weights[index]
      }
    })
    scores[category] = score
  })
  
  // Find the category with highest score
  const maxScore = Math.max(...Object.values(scores))
  const detectedCategory = Object.keys(scores).find(key => scores[key] === maxScore) || 'OTHER'
  
  // Calculate confidence based on score difference
  const sortedScores = Object.values(scores).sort((a, b) => b - a)
  const confidence = maxScore > 0 ? Math.min(maxScore / (sortedScores[1] || 1), 1) : 0
  
  // Generate reasoning
  const reasoning = generateCategoryReasoning(text, detectedCategory, scores)
  
  return {
    category: detectedCategory,
    confidence: Math.round(confidence * 100),
    reasoning
  }
}

function generateCategoryReasoning(text: string, category: string, scores: { [key: string]: number }): string {
  const reasons: string[] = []
  
  // Find the keywords that contributed to the score
  const categoryKeywords: { [key: string]: string[] } = {
    'NOTES': ['notes', 'handwritten', 'pdf', 'study material'],
    'BOOKS': ['book', 'textbook', 'reference', 'guide'],
    'BIKES': ['bike', 'bicycle', 'scooter', 'electric'],
    'FOOD_TOKENS': ['token', 'mess', 'canteen', 'food'],
    'ROOM_RENTALS': ['room', 'rent', 'pg', 'hostel']
  }
  
  const foundKeywords: string[] = []
  categoryKeywords[category]?.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    if (text.match(regex)) {
      foundKeywords.push(keyword)
    }
  })
  
  if (foundKeywords.length > 0) {
    reasons.push(`Detected keywords: ${foundKeywords.join(', ')}`)
  }
  
  // Compare with other categories
  const otherCategories = Object.keys(scores).filter(c => c !== category)
  const secondHighest = otherCategories.reduce((max, cat) => scores[cat] > scores[max] ? cat : max, otherCategories[0])
  
  if (scores[category] > scores[secondHighest] * 1.5) {
    reasons.push(`Strong match for ${category.replace('_', ' ')} category`)
  } else if (scores[category] > scores[secondHighest] * 1.2) {
    reasons.push(`Good match for ${category.replace('_', ' ')} category`)
  } else {
    reasons.push(`Possible match for ${category.replace('_', ' ')} category`)
  }
  
  return reasons.join('. ') + '.'
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()

    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Title is required' },
        { status: 400 }
      )
    }

    // Get AI category detection
    const detection = detectCategory(title, description)
    
    // Get all available categories
    const categories = [
      'NOTES',
      'BOOKS', 
      'BIKES',
      'FOOD_TOKENS',
      'ROOM_RENTALS'
    ]
    
    // Generate confidence scores for all categories
    const allScores = categories.map(cat => {
      const catDetection = detectCategory(title, description)
      return {
        category: cat,
        confidence: catDetection.category === cat ? catDetection.confidence : 0,
        isRecommended: catDetection.category === cat
      }
    }).sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({
      success: true,
      detection: {
        recommendedCategory: detection.category,
        confidence: detection.confidence,
        reasoning: detection.reasoning,
        allCategories: allScores
      }
    })

  } catch (error) {
    console.error('Category detection error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}