import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { title, description, imageUrl, targetUrl, category, location, campusId, userId, endDate } = await request.json()

    if (!title || !category || !campusId || !userId) {
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

    // Calculate end date (1 month from start if not provided)
    const startDate = new Date()
    const adEndDate = endDate ? new Date(endDate) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Create the business ad
    const businessAd = await db.businessAd.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        targetUrl: targetUrl?.trim() || null,
        category: category,
        location: location?.trim() || null,
        campusId: campusId,
        startDate: startDate,
        endDate: adEndDate,
        monthlyFee: 199 // ₹199 per month
      }
    })

    // Create transaction for business ad fee
    const transaction = await db.transaction.create({
      data: {
        type: 'BUSINESS_AD',
        amount: 199,
        currency: 'INR',
        status: 'COMPLETED',
        description: `Business ad: ${title}`,
        userId: userId,
        businessAdId: businessAd.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Business ad created successfully',
      businessAd: {
        id: businessAd.id,
        title: businessAd.title,
        category: businessAd.category,
        monthlyFee: businessAd.monthlyFee,
        startDate: businessAd.startDate,
        endDate: businessAd.endDate,
        transactionId: transaction.id
      }
    })

  } catch (error) {
    console.error('Create business ad error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}