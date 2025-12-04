import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title, description, price, category, condition, location, userId } = await request.json()

    if (!title || !category || !price || !userId) {
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

    // Get user's campus
    const campus = await db.campus.findUnique({
      where: { id: user.campusId }
    })

    if (!campus) {
      return NextResponse.json(
        { success: false, message: 'Campus not found' },
        { status: 404 }
      )
    }

    // Get category
    const categoryRecord = await db.category.findFirst({
      where: { 
        OR: [
          { name: { contains: category.split('_').join(' ') } },
          { name: { equals: category } }
        ]
      }
    })

    if (!categoryRecord) {
      return NextResponse.json(
        { success: false, message: 'Category not found' },
        { status: 404 }
      )
    }

    // Check if user is premium (no listing fee)
    const isPremium = user.isPremium && user.premiumExpires && new Date(user.premiumExpires) > new Date()

    // Calculate commission for high-value items
    const itemPrice = parseFloat(price)
    let commissionTransaction = null
    let commissionRate = null

    // Apply commission for items above ₹5000
    if (itemPrice > 5000) {
      // Calculate commission rate based on price tiers
      if (itemPrice > 50000) {
        commissionRate = 5 // 5% for items above ₹50,000
      } else if (itemPrice > 20000) {
        commissionRate = 4 // 4% for items above ₹20,000
      } else if (itemPrice > 10000) {
        commissionRate = 3 // 3% for items above ₹10,000
      } else {
        commissionRate = 2 // 2% for items above ₹5,000
      }

      const commissionAmount = (itemPrice * commissionRate) / 100

      // Create commission transaction (will be charged when item is sold)
      commissionTransaction = await db.transaction.create({
        data: {
          type: 'HIGH_VALUE_COMMISSION',
          amount: commissionAmount,
          currency: 'INR',
          status: 'PENDING', // Will be marked as COMPLETED when item is sold
          commissionRate: commissionRate,
          description: `Commission for high-value item: ${title}`,
          userId: userId
        }
      })
    }

    // Create transaction record for listing fee (unless premium)
    let transaction = null
    let serviceTransaction = null
    
    if (!isPremium) {
      transaction = await db.transaction.create({
        data: {
          type: 'LISTING_FEE',
          amount: 10,
          currency: 'INR',
          status: 'COMPLETED',
          paymentMethod: 'UPI',
          description: 'Listing fee for marketplace item',
          userId: userId
        }
      })

      // Add service fee for service marketplace listings
      if (category.startsWith('SERVICES_')) {
        serviceTransaction = await db.transaction.create({
          data: {
            type: 'SERVICE_MARKETPLACE_FEE',
            amount: 15, // ₹15 additional fee for service listings
            currency: 'INR',
            status: 'COMPLETED',
            paymentMethod: 'UPI',
            description: 'Service marketplace fee for service listing',
            userId: userId
          }
        })
      }
    }

    // Create the listing
    const listing = await db.listing.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        category: category,
        condition: condition || null,
        images: '[]', // Empty JSON array for now
        location: location?.trim() || null,
        userId: userId,
        campusId: campus.id,
        categoryId: categoryRecord.id,
        // Set expiration for food tokens (7 days) and room rentals (30 days)
        expiresAt: category === 'FOOD_TOKENS' 
          ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          : category === 'ROOM_RENTALS'
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : null
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Listing created successfully',
      listing: {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        category: listing.category,
        isPremium: isPremium,
        feeWaived: isPremium,
        transactionId: transaction?.id,
        commission: commissionTransaction ? {
          rate: commissionRate,
          amount: commissionTransaction.amount,
          status: commissionTransaction.status
        } : null,
        serviceFee: serviceTransaction ? {
          amount: serviceTransaction.amount,
          status: serviceTransaction.status
        } : null
      }
    })

  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}