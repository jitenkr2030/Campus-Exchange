import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, otp } = await request.json()

    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number' },
        { status: 400 }
      )
    }

    if (!otp || otp.length !== 6) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Retrieve OTP from Redis
    // 2. Check if it matches and hasn't expired
    // 3. Delete the OTP after verification
    
    // For demo purposes, we'll accept '123456' as valid OTP
    if (otp !== '123456') {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { phone: `+91${phoneNumber}` }
    })

    if (existingUser) {
      // Return existing user data
      return NextResponse.json({
        success: true,
        isUserExists: true,
        user: {
          id: existingUser.id,
          name: existingUser.name,
          phone: existingUser.phone,
          email: existingUser.email,
          isVerified: existingUser.isVerified,
          isPremium: existingUser.isPremium
        }
      })
    } else {
      // User doesn't exist, needs to complete profile
      return NextResponse.json({
        success: true,
        isUserExists: false,
        message: 'Please complete your profile'
      })
    }

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}