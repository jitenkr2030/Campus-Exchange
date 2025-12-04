import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate premium expiry (1 month from now)
    const premiumExpires = new Date()
    premiumExpires.setMonth(premiumExpires.getMonth() + 1)

    // Update user to premium
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumExpires: premiumExpires
      }
    })

    // Create premium subscription transaction
    const transaction = await db.transaction.create({
      data: {
        type: 'PREMIUM_SUBSCRIPTION',
        amount: 99,
        currency: 'INR',
        status: 'COMPLETED',
        description: 'Premium membership subscription - 1 month',
        userId: userId
      }
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
      transaction,
      message: 'Premium subscription activated successfully'
    })

  } catch (error) {
    console.error('Error subscribing to premium:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}