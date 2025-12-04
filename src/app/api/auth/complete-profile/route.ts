import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, name, email } = await request.json()

    if (!phoneNumber || phoneNumber.length !== 10) {
      return NextResponse.json(
        { success: false, message: 'Invalid phone number' },
        { status: 400 }
      )
    }

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { phone: `+91${phoneNumber}` }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      )
    }

    // For demo purposes, we'll use a default campus
    // In a real app, you would determine campus based on location or user selection
    let campus = await db.campus.findFirst()
    
    if (!campus) {
      // Create a default campus if none exists
      campus = await db.campus.create({
        data: {
          name: 'Demo University',
          city: 'Demo City',
          state: 'Demo State'
        }
      })
    }

    // Create default categories if they don't exist
    const categories = [
      { name: 'Notes Marketplace', description: 'Handwritten notes, PDFs, previous year papers', icon: 'FileText', color: 'blue' },
      { name: 'Used Books', description: 'Textbooks, reference books, competitive exam materials', icon: 'BookOpen', color: 'green' },
      { name: 'Used Bikes & E-Cycles', description: 'Campus bicycles, electric scooters, two-wheelers', icon: 'Bike', color: 'purple' },
      { name: 'Food Tokens', description: 'Sell unused mess/canteen tokens, avoid food waste', icon: 'Utensils', color: 'orange' },
      { name: 'Room Rentals', description: 'PG rooms, hostel switching, shared apartments', icon: 'Home', color: 'pink' }
    ]

    for (const categoryData of categories) {
      const existingCategory = await db.category.findUnique({
        where: { name: categoryData.name }
      })
      
      if (!existingCategory) {
        await db.category.create({
          data: categoryData
        })
      }
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        phone: `+91${phoneNumber}`,
        name: name.trim(),
        email: email?.trim() || null,
        campusId: campus.id,
        isVerified: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        isVerified: newUser.isVerified,
        isPremium: newUser.isPremium
      }
    })

  } catch (error) {
    console.error('Complete profile error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}