import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { adId } = await request.json()

    if (!adId) {
      return NextResponse.json(
        { success: false, message: 'Ad ID is required' },
        { status: 400 }
      )
    }

    // Get the business ad
    const businessAd = await db.businessAd.findUnique({
      where: { id: adId }
    })

    if (!businessAd) {
      return NextResponse.json(
        { success: false, message: 'Business ad not found' },
        { status: 404 }
      )
    }

    // Increment click count
    const updatedAd = await db.businessAd.update({
      where: { id: adId },
      data: { clicks: businessAd.clicks + 1 }
    })

    return NextResponse.json({
      success: true,
      message: 'Click tracked successfully',
      clicks: updatedAd.clicks
    })

  } catch (error) {
    console.error('Track ad click error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}