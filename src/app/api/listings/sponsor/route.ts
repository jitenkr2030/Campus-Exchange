import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { listingId, userId } = await request.json()

    if (!listingId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get the listing details
    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: {
        user: true
      }
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if user owns the listing
    if (listing.userId !== userId) {
      return NextResponse.json(
        { success: false, message: 'You can only sponsor your own listings' },
        { status: 403 }
      )
    }

    // Check if listing is already sponsored
    if (listing.isFeatured) {
      return NextResponse.json(
        { success: false, message: 'This listing is already sponsored' },
        { status: 400 }
      )
    }

    // Check if user is premium (discounted boost fee)
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isPremium: true }
    })

    const isPremium = user?.isPremium || false
    const boostFee = isPremium ? 15 : 25 // 40% discount for premium users

    // Create sponsored listing transaction
    const transaction = await db.transaction.create({
      data: {
        type: 'SPONSORED_LISTING',
        amount: boostFee,
        currency: 'INR',
        status: 'COMPLETED',
        description: `Sponsored listing boost: ${listing.title}`,
        userId: userId,
        listingId: listingId
      }
    })

    // Update listing to featured (sponsored)
    const updatedListing = await db.listing.update({
      where: { id: listingId },
      data: {
        isFeatured: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Listing sponsored successfully',
      listing: updatedListing,
      transaction,
      boostFee,
      isPremium
    })

  } catch (error) {
    console.error('Sponsor listing error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}