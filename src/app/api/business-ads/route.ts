import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campusId = searchParams.get('campusId')
    const category = searchParams.get('category')
    const active = searchParams.get('active')

    const whereClause: any = {}
    
    if (campusId) {
      whereClause.campusId = campusId
    }
    
    if (category) {
      whereClause.category = category
    }
    
    if (active === 'true') {
      whereClause.isActive = true
      const now = new Date()
      whereClause.startDate = { lte: now }
      whereClause.OR = [
        { endDate: null },
        { endDate: { gte: now } }
      ]
    }

    const businessAds = await db.businessAd.findMany({
      where: whereClause,
      include: {
        campus: {
          select: {
            id: true,
            name: true,
            city: true,
            state: true
          }
        },
        transactions: {
          select: {
            id: true,
            amount: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      success: true,
      businessAds
    })

  } catch (error) {
    console.error('Get business ads error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}