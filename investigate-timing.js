const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function investigatePremiumTiming() {
  try {
    // Get all transactions for user-2 in chronological order
    const transactions = await prisma.transaction.findMany({
      where: { userId: 'user-2' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true
      }
    })

    console.log('All Transactions for User-2 (Chronological):')
    transactions.forEach((tx, index) => {
      console.log(`${index + 1}. ${tx.createdAt.toISOString()}`)
      console.log(`   Type: ${tx.type}`)
      console.log(`   Amount: ₹${tx.amount}`)
      console.log(`   Description: ${tx.description}`)
      console.log('')
    })

    // Check user-2's premium status timeline
    const user = await prisma.user.findUnique({
      where: { id: 'user-2' }
    })

    console.log('User-2 Premium Status:')
    console.log('  isPremium:', user.isPremium)
    console.log('  premiumExpires:', user.premiumExpires?.toISOString())

    // Check the exact timing of premium subscription vs listing creation
    const premiumTx = transactions.find(tx => tx.type === 'PREMIUM_SUBSCRIPTION')
    const listingTxs = transactions.filter(tx => tx.type === 'LISTING_FEE')

    if (premiumTx && listingTxs.length > 0) {
      console.log('\n--- Timing Analysis ---')
      console.log('Premium Subscription Time:', premiumTx.createdAt.toISOString())
      
      listingTxs.forEach((tx, index) => {
        console.log(`Listing Fee ${index + 1} Time:`, tx.createdAt.toISOString())
        const isAfterPremium = tx.createdAt > premiumTx.createdAt
        console.log(`  Created After Premium: ${isAfterPremium}`)
        if (isAfterPremium) {
          console.log('  ❌ ERROR: Listing fee charged after premium subscription!')
        }
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

investigatePremiumTiming()