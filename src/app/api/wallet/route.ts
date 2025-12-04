import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get or create wallet for user
    let wallet = await db.wallet.findUnique({
      where: { userId: userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    // Create wallet if it doesn't exist
    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId: userId,
          balance: 0
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      })
    }

    return NextResponse.json({
      success: true,
      wallet: {
        id: wallet.id,
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive,
        transactions: wallet.transactions.map(tx => ({
          id: tx.id,
          type: tx.type,
          amount: tx.amount,
          balance: tx.balance,
          description: tx.description,
          referenceType: tx.referenceType,
          status: tx.status,
          createdAt: tx.createdAt
        }))
      }
    })

  } catch (error) {
    console.error('Get wallet error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, type, amount, description, referenceId, referenceType } = await request.json()

    if (!userId || !type || !amount) {
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

    // Get or create wallet
    let wallet = await db.wallet.findUnique({
      where: { userId: userId }
    })

    if (!wallet) {
      wallet = await db.wallet.create({
        data: {
          userId: userId,
          balance: 0
        }
      })
    }

    // Calculate new balance
    const transactionAmount = parseFloat(amount)
    let newBalance = wallet.balance

    if (type === 'CREDIT') {
      newBalance += transactionAmount
    } else if (type === 'DEBIT') {
      if (wallet.balance < transactionAmount) {
        return NextResponse.json(
          { success: false, message: 'Insufficient balance' },
          { status: 400 }
        )
      }
      newBalance -= transactionAmount
    } else if (type === 'REFUND') {
      newBalance += transactionAmount
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid transaction type' },
        { status: 400 }
      )
    }

    // Create wallet transaction
    const walletTransaction = await db.walletTransaction.create({
      data: {
        type: type,
        amount: transactionAmount,
        balance: newBalance,
        description: description || `${type.toLowerCase()} transaction`,
        referenceId: referenceId,
        referenceType: referenceType,
        walletId: wallet.id
      }
    })

    // Update wallet balance
    const updatedWallet = await db.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: newBalance,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Wallet transaction completed successfully',
      transaction: {
        id: walletTransaction.id,
        type: walletTransaction.type,
        amount: walletTransaction.amount,
        balance: walletTransaction.balance,
        description: walletTransaction.description,
        referenceType: walletTransaction.referenceType,
        status: walletTransaction.status,
        createdAt: walletTransaction.createdAt
      },
      wallet: {
        id: updatedWallet.id,
        balance: updatedWallet.balance,
        currency: updatedWallet.currency
      }
    })

  } catch (error) {
    console.error('Wallet transaction error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}