import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { userId, amount, paymentMethod } = await request.json()

    if (!userId || !amount || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const addAmount = parseFloat(amount)
    if (addAmount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Amount must be greater than 0' },
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

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create wallet transaction for adding money
    const walletTransaction = await db.walletTransaction.create({
      data: {
        type: 'CREDIT',
        amount: addAmount,
        balance: wallet.balance + addAmount,
        description: `Money added via ${paymentMethod}`,
        referenceType: 'WALLET_TOPUP',
        walletId: wallet.id
      }
    })

    // Update wallet balance
    const updatedWallet = await db.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: wallet.balance + addAmount,
        updatedAt: new Date()
      }
    })

    // Create transaction record for payment
    await db.transaction.create({
      data: {
        type: 'WALLET_TOPUP',
        amount: addAmount,
        currency: 'INR',
        status: 'COMPLETED',
        paymentMethod: paymentMethod,
        description: `Wallet topup: ₹${addAmount}`,
        userId: userId
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Money added to wallet successfully',
      transaction: {
        id: walletTransaction.id,
        type: walletTransaction.type,
        amount: walletTransaction.amount,
        balance: walletTransaction.balance,
        description: walletTransaction.description,
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
    console.error('Add money to wallet error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}