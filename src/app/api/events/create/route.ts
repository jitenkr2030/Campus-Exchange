import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { 
      title, 
      description, 
      imageUrl, 
      category, 
      location, 
      startDate, 
      endDate, 
      organizerName, 
      organizerContact, 
      maxParticipants, 
      fee, 
      partnershipFee,
      campusId, 
      userId 
    } = await request.json()

    if (!title || !category || !startDate || !endDate || !campusId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify campus exists
    const campus = await db.campus.findUnique({
      where: { id: campusId }
    })

    if (!campus) {
      return NextResponse.json(
        { success: false, message: 'Campus not found' },
        { status: 404 }
      )
    }

    // Create the event
    const event = await db.event.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        category: category,
        location: location?.trim() || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        organizerName: organizerName?.trim() || null,
        organizerContact: organizerContact?.trim() || null,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        fee: fee ? parseFloat(fee) : null,
        partnershipFee: partnershipFee ? parseFloat(partnershipFee) : null,
        campusId: campusId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event: {
        id: event.id,
        title: event.title,
        category: event.category,
        startDate: event.startDate,
        endDate: event.endDate,
        fee: event.fee,
        partnershipFee: event.partnershipFee
      }
    })

  } catch (error) {
    console.error('Create event error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}