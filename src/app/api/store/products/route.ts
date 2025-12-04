import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campusId = searchParams.get('campusId')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!campusId) {
      return NextResponse.json(
        { success: false, message: 'Campus ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      campusId: campusId,
      isActive: true,
      stockQuantity: {
        gt: 0
      }
    }

    if (category && category !== 'ALL') {
      whereClause.category = category
    }

    const products = await db.product.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' },
        { name: 'asc' }
      ],
      take: limit
    })

    return NextResponse.json({
      success: true,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        price: product.price,
        stockQuantity: product.stockQuantity,
        sku: product.sku,
        isDigital: product.isDigital,
        digitalUrl: product.digitalUrl
      }))
    })

  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      description, 
      imageUrl, 
      category, 
      price, 
      stockQuantity, 
      sku, 
      isDigital, 
      digitalUrl, 
      weight, 
      dimensions, 
      campusId, 
      userId 
    } = await request.json()

    if (!name || !category || !price || !campusId || !userId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify user exists and is admin/premium (for now, allow any authenticated user)
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

    // Create the product
    const product = await db.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        category: category,
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity) || 0,
        sku: sku?.trim() || null,
        isDigital: isDigital || false,
        digitalUrl: digitalUrl?.trim() || null,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensions?.trim() || null,
        campusId: campusId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stockQuantity: product.stockQuantity
      }
    })

  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}