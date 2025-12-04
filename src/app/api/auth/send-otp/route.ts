import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Generate a 6-digit OTP
    // 2. Store it in Redis with expiration
    // 3. Send it via WhatsApp/SMS using a service like Twilio
    
    // For demo purposes, we'll use a fixed OTP
    const otp = '123456' // In production, generate random OTP
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { phone: `+91${phoneNumber}` }
    })

    // Store OTP in database (in production, use Redis)
    // For demo, we'll just simulate OTP storage
    
    console.log(`OTP for +91${phoneNumber}: ${otp}`) // Log for demo purposes

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      isUserExists: !!existingUser
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}