import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { senderId, receiverId, listingId, content, type = 'TEXT' } = await request.json()

    if (!senderId || !receiverId || !listingId || !content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify users exist
    const [sender, receiver] = await Promise.all([
      db.user.findUnique({ where: { id: senderId } }),
      db.user.findUnique({ where: { id: receiverId } })
    ])

    if (!sender || !receiver) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify listing exists and belongs to one of the users
    const listing = await db.listing.findFirst({
      where: {
        id: listingId,
        OR: [
          { userId: senderId },
          { userId: receiverId }
        ]
      }
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, message: 'Listing not found or access denied' },
        { status: 404 }
      )
    }

    // Create message
    const message = await db.message.create({
      data: {
        senderId,
        receiverId,
        listingId,
        content,
        type
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true
          }
        }
      }
    })

    // In a real implementation, you would emit this message via WebSocket
    // For now, we'll just return the created message

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: message
    })

  } catch (error) {
    console.error('Send message error:', error)
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
    const otherUserId = searchParams.get('otherUserId')
    const listingId = searchParams.get('listingId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID required' },
        { status: 400 }
      )
    }

    // Build where clause
    const where: any = {
      OR: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }

    if (listingId) {
      where.listingId = listingId
    }

    // Fetch messages
    const messages = await db.message.findMany({
      where,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            category: true
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
      skip: offset
    })

    // Mark messages as read (in a real app, you'd have a read status)
    await db.message.updateMany({
      where: {
        receiverId: userId,
        senderId: otherUserId,
        listingId
      },
      data: { /* Add read status field if needed */ }
    })

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        limit,
        offset,
        total: messages.length
      }
    })

  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}