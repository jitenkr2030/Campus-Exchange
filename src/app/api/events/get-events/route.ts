import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campusId = searchParams.get('campusId')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')
    const upcomingOnly = searchParams.get('upcomingOnly') === 'true'

    if (!campusId) {
      return NextResponse.json(
        { success: false, message: 'Campus ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      campusId: campusId,
      isActive: true
    }

    if (upcomingOnly) {
      whereClause.startDate = {
        gte: new Date()
      }
    }

    if (category && category !== 'ALL') {
      whereClause.category = category
    }

    const events = await db.event.findMany({
      where: whereClause,
      orderBy: [
        { startDate: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    return NextResponse.json({
      success: true,
      events: events.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        category: event.category,
        location: event.location,
        startDate: event.startDate,
        endDate: event.endDate,
        organizerName: event.organizerName,
        maxParticipants: event.maxParticipants,
        currentParticipants: event.currentParticipants,
        fee: event.fee,
        isPartnered: event.isPartnered,
        partnershipFee: event.partnershipFee
      }))
    })

  } catch (error) {
    console.error('Get events error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}