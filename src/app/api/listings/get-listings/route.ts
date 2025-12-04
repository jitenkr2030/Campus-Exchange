import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const campusId = searchParams.get('campusId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build where clause
    const where: any = {
      isAvailable: true
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (campusId) {
      where.campusId = campusId
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

    // Increment views for each listing (in production, you might want to do this differently)
    for (const listing of listings) {
      await db.listing.update({
        where: { id: listing.id },
        data: { views: listing.views + 1 }
      })
    }

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
        views: listing.views + 1, // Return incremented view count
        contactUnlocked: listing.contactUnlocked,
        createdAt: listing.createdAt,
        user: listing.user,
        campus: listing.campus,
        categoryData: listing.categoryRelation
      }))
    })

  } catch (error) {
    console.error('Get listings error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}