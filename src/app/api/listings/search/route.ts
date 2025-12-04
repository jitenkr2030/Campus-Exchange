import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '50000')
    const condition = searchParams.get('condition')?.split(',').filter(Boolean) || []
    const location = searchParams.get('location') || ''
    const verified = searchParams.get('verified') === 'true'
    const premium = searchParams.get('premium') === 'true'
    const hasImages = searchParams.get('hasImages') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      isAvailable: true,
      price: {
        gte: minPrice,
        lte: maxPrice
      }
    }

    // Add search term filtering
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (condition.length > 0) {
      where.condition = { in: condition }
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (verified) {
      where.user = {
        isVerified: true
      }
    }

    if (premium) {
      where.user = {
        isPremium: true
      }
    }

    if (hasImages) {
      where.images = {
        not: '[]'
      }
    }

    // Fetch listings with user and campus data
    const listings = await db.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            isPremium: true
          }
        },
        campus: {
          select: {
            id: true,
            name: true,
            city: true
          }
        },
        categoryRelation: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    // Calculate relevance score for search results
    const listingsWithScore = listings.map(listing => {
      let score = 0
      
      if (q) {
        // Boost exact matches in title
        if (listing.title.toLowerCase().includes(q.toLowerCase())) {
          score += 10
        }
        // Boost matches in description
        if (listing.description?.toLowerCase().includes(q.toLowerCase())) {
          score += 5
        }
      }
      
      // Boost featured listings
      if (listing.isFeatured) score += 5
      
      // Boost verified sellers
      if (listing.user.isVerified) score += 3
      
      // Boost premium sellers
      if (listing.user.isPremium) score += 2
      
      // Boost listings with images
      if (listing.images && listing.images !== '[]') score += 1
      
      return { ...listing, score }
    })

    // Sort by score (for relevance) or other criteria
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const sortedListings = listingsWithScore.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price
        case 'price_high':
          return b.price - a.price
        case 'popular':
          return b.views - a.views
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'relevance':
        default:
          return b.score - a.score
      }
    })

    // Increment views for each listing
    for (const listing of sortedListings) {
      await db.listing.update({
        where: { id: listing.id },
        data: { views: listing.views + 1 }
      })
    }

    return NextResponse.json({
      success: true,
      listings: sortedListings.map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        location: listing.location,
        isAvailable: listing.isAvailable,
        isFeatured: listing.isFeatured,
        views: listing.views + 1,
        contactUnlocked: listing.contactUnlocked,
        createdAt: listing.createdAt,
        user: listing.user,
        campus: listing.campus,
        categoryData: listing.categoryRelation,
        relevanceScore: listing.score
      })),
      total: sortedListings.length,
      query: q,
      filters: {
        category,
        minPrice,
        maxPrice,
        condition,
        location,
        verified,
        premium,
        hasImages
      }
    })

  } catch (error) {
    console.error('Search listings error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}