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
        user: true,
        transactions: {
          where: {
            type: 'CONTACT_UNLOCK',
            userId: userId,
            listingId: listingId
          }
        }
      }
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found' },
        { status: 404 }
      )
    }

    // Check if user already unlocked this contact
    if (listing.transactions.length > 0) {
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        contact: {
          phone: listing.user.phone,
          email: listing.user.email,
          name: listing.user.name
        }
      })
    }

    // Check if user is trying to unlock their own listing
    if (listing.userId === userId) {
      return NextResponse.json({
        success: true,
        ownListing: true,
        contact: {
          phone: listing.user.phone,
          email: listing.user.email,
          name: listing.user.name
        }
      })
    }

    // Check if user is premium (free contact unlock)
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { isPremium: true }
    })

    const isPremium = user?.isPremium || false

    // Create contact unlock transaction
    const transaction = await db.transaction.create({
      data: {
        type: 'CONTACT_UNLOCK',
        amount: isPremium ? 0 : 5, // ₹5 fee, free for premium users
        currency: 'INR',
        status: 'COMPLETED',
        description: `Contact unlock for listing: ${listing.title}`,
        userId: userId,
        listingId: listingId
      }
    })

    // Return contact information
    return NextResponse.json({
      success: true,
      transaction,
      isPremium,
      contact: {
        phone: listing.user.phone,
        email: listing.user.email,
        name: listing.user.name
      }
    })

  } catch (error) {
    console.error('Error unlocking contact:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}