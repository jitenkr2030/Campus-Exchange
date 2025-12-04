import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const condition = searchParams.get('condition')
    const location = searchParams.get('location')
    const campusId = searchParams.get('campusId')
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      isAvailable: true
    }

    // Text search across multiple fields
    if (query.trim()) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (minPrice) {
      where.price = { gte: parseFloat(minPrice) }
    }

    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) }
    }

    if (condition && condition !== 'all') {
      where.condition = condition
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (campusId) {
      where.campusId = campusId
    }

    // Build order by clause based on sort option
    let orderBy: any = []
    
    switch (sortBy) {
      case 'price_low':
        orderBy = [{ price: 'asc' }]
        break
      case 'price_high':
        orderBy = [{ price: 'desc' }]
        break
      case 'newest':
        orderBy = [{ createdAt: 'desc' }]
        break
      case 'popular':
        orderBy = [{ views: 'desc' }]
        break
      case 'relevance':
      default:
        // For relevance, prioritize exact matches in title, then description
        orderBy = [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ]
        break
    }

    // Fetch listings with related data
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
      orderBy,
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const total = await db.listing.count({ where })

    // Get search suggestions/facets
    const facets = await getSearchFacets(where)

    return NextResponse.json({
      success: true,
      listings: listings.map(listing => ({
        id: listing.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category,
        condition: listing.condition,
        location: listing.location,
        isAvailable: listing.isAvailable,
        isFeatured: listing.isFeatured,
        views: listing.views,
        contactUnlocked: listing.contactUnlocked,
        createdAt: listing.createdAt,
        user: listing.user,
        campus: listing.campus,
        categoryData: listing.categoryRelation
      })),
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      },
      facets,
      query: {
        q: query,
        category,
        minPrice,
        maxPrice,
        condition,
        location,
        sortBy
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getSearchFacets(where: any) {
  try {
    // Get category counts
    const categoryCounts = await db.listing.groupBy({
      by: ['category'],
      where: where,
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } }
    })

    // Get condition counts
    const conditionCounts = await db.listing.groupBy({
      by: ['condition'],
      where: { ...where, condition: { not: null } },
      _count: { condition: true },
      orderBy: { _count: { condition: 'desc' } }
    })

    // Get price range
    const priceStats = await db.listing.aggregate({
      where: where,
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true }
    })

    // Get location counts
    const locationCounts = await db.listing.groupBy({
      by: ['location'],
      where: { ...where, location: { not: null } },
      _count: { location: true },
      orderBy: { _count: { location: 'desc' } },
      take: 10
    })

    return {
      categories: categoryCounts.map(item => ({
        value: item.category,
        label: item.category.replace('_', ' '),
        count: item._count.category
      })),
      conditions: conditionCounts.map(item => ({
        value: item.condition,
        label: item.condition?.replace('_', ' ') || 'Unknown',
        count: item._count.condition
      })),
      priceRange: {
        min: priceStats._min.price || 0,
        max: priceStats._max.price || 0,
        average: Math.round((priceStats._avg.price || 0) * 100) / 100
      },
      locations: locationCounts.map(item => ({
        value: item.location,
        label: item.location || 'Unknown',
        count: item._count.location
      }))
    }
  } catch (error) {
    console.error('Error getting facets:', error)
    return {
      categories: [],
      conditions: [],
      priceRange: { min: 0, max: 0, average: 0 },
      locations: []
    }
  }
}