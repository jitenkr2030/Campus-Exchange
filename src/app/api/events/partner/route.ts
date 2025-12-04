import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { eventId, userId, sponsorshipLevel, benefitsOffered } = await request.json()

    if (!eventId || !userId || !sponsorshipLevel) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the event details
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        campus: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { success: false, message: 'Event not found' },
        { status: 404 }
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

    // Calculate partnership fee based on sponsorship level
    const partnershipFees = {
      'PLATINUM': 5000,
      'GOLD': 3000,
      'SILVER': 1500,
      'BRONZE': 500
    }

    const partnershipFee = partnershipFees[sponsorshipLevel as keyof typeof partnershipFees] || 1000

    // Create event partnership transaction
    const transaction = await db.transaction.create({
      data: {
        type: 'EVENT_PARTNERSHIP',
        amount: partnershipFee,
        currency: 'INR',
        status: 'COMPLETED',
        description: `Event partnership - ${sponsorshipLevel} sponsor for ${event.title}`,
        userId: userId,
        eventId: eventId
      }
    })

    // Update event to partnered status
    const updatedEvent = await db.event.update({
      where: { id: eventId },
      data: {
        isPartnered: true,
        partnershipFee: partnershipFee
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Event partnership created successfully',
      event: updatedEvent,
      transaction,
      partnershipFee,
      sponsorshipLevel
    })

  } catch (error) {
    console.error('Create event partnership error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}