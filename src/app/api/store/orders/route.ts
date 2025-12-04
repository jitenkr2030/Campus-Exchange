import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, notes, campusId, userId } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0 || !campusId || !userId) {
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

    // Get product details and calculate total
    let totalAmount = 0
    const orderItemsData = []

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.productId}` },
          { status: 404 }
        )
      }

      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { success: false, message: `Insufficient stock for product: ${product.name}` },
          { status: 400 }
        )
      }

      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      })
    }

    // Generate order number
    const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber: orderNumber,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress?.trim() || null,
        notes: notes?.trim() || null,
        userId: userId,
        campusId: campusId
      }
    })

    // Create order items and update product stock
    for (const itemData of orderItemsData) {
      await db.orderItem.create({
        data: {
          orderId: order.id,
          productId: itemData.productId,
          quantity: itemData.quantity,
          price: itemData.price
        }
      })

      // Update product stock
      await db.product.update({
        where: { id: itemData.productId },
        data: {
          stockQuantity: {
            decrement: itemData.quantity
          }
        }
      })
    }

    // Create transaction for the order
    const transaction = await db.transaction.create({
      data: {
        type: 'CAMPUS_STORE_PURCHASE',
        amount: totalAmount,
        currency: 'INR',
        status: 'COMPLETED',
        description: `Campus store purchase: ${orderNumber}`,
        userId: userId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        transactionId: transaction.id
      }
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const campusId = searchParams.get('campusId')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    const whereClause: any = {
      userId: userId
    }

    if (campusId) {
      whereClause.campusId = campusId
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                category: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderItems: order.orderItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: item.product
        }))
      }))
    })

  } catch (error) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}