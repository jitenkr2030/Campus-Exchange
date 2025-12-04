import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campusId = searchParams.get('campusId')
    const category = searchParams.get('category')
    const seekingPartners = searchParams.get('seekingPartners')

    const whereClause: any = {
      isActive: true
    }
    
    if (campusId) {
      whereClause.campusId = campusId
    }
    
    if (category) {
      whereClause.category = category
    }
    
    if (seekingPartners === 'true') {
      whereClause.isPartnered = false
    }

    const events = await db.event.findMany({
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
            type: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    return NextResponse.json({
      success: true,
      events
    })

  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}