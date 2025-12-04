import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campusId = searchParams.get('campusId')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!campusId) {
      return NextResponse.json(
        { success: false, message: 'Campus ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      campusId: campusId,
      isActive: true,
      startDate: {
        lte: new Date()
      },
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } }
      ]
    }

    if (category && category !== 'ALL') {
      whereClause.category = category
    }

    const businessAds = await db.businessAd.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' },
        { impressions: 'asc' } // Show less viewed ads first
      ],
      take: limit
    })

    // Increment impressions for returned ads
    for (const ad of businessAds) {
      await db.businessAd.update({
        where: { id: ad.id },
        data: { impressions: ad.impressions + 1 }
      })
    }

    return NextResponse.json({
      success: true,
      businessAds: businessAds.map(ad => ({
        id: ad.id,
        title: ad.title,
        description: ad.description,
        imageUrl: ad.imageUrl,
        targetUrl: ad.targetUrl,
        category: ad.category,
        location: ad.location,
        impressions: ad.impressions,
        clicks: ad.clicks
      }))
    })

  } catch (error) {
    console.error('Get business ads error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}