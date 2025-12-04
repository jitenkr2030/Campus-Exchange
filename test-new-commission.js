const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkNewHighValueCommission() {
  try {
    // Get the latest listing (should be the high-value gaming laptop)
    const latestListing = await prisma.listing.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        transactions: {
          where: {
            type: 'HIGH_VALUE_COMMISSION'
          }
        }
      }
    })

    console.log('Latest High-Value Listing:')
    console.log('  Title:', latestListing.title)
    console.log('  Price: ₹', latestListing.price)
    console.log('  Owner:', latestListing.user.name)

    // Check commission transaction
    if (latestListing.transactions.length > 0) {
      const commissionTx = latestListing.transactions[0]
      console.log('\nCommission Transaction:')
      console.log('  Amount: ₹', commissionTx.amount)
      console.log('  Rate:', commissionTx.commissionRate, '%')
      console.log('  Status:', commissionTx.status)
      console.log('  Description:', commissionTx.description)

      // Verify commission calculation
      const price = latestListing.price
      const expectedRate = price > 50000 ? 5 : 
                           price > 20000 ? 4 :
                           price > 10000 ? 3 :
                           price > 5000 ? 2 : 0
      
      const expectedAmount = (price * expectedRate) / 100
      const actualAmount = commissionTx.amount
      const isCorrect = Math.abs(actualAmount - expectedAmount) < 0.01

      console.log('\nCommission Verification:')
      console.log('  Price: ₹', price)
      console.log('  Expected Rate:', expectedRate, '%')
      console.log('  Expected Amount: ₹', expectedAmount)
      console.log('  Actual Amount: ₹', actualAmount)
      console.log('  Calculation Correct:', isCorrect ? '✅ YES' : '❌ NO')

      if (isCorrect) {
        console.log('\n✅ COMMISSION SYSTEM WORKING CORRECTLY FOR NEW HIGH-VALUE LISTING!')
      }
    } else {
      console.log('\n❌ No commission transaction found for new high-value listing!')
      console.log('This might be expected if the price is below ₹5,000 threshold')
    }

    // Also check if listing fee was charged (user-3 is not premium)
    const listingFeeTx = await prisma.transaction.findFirst({
      where: {
        type: 'LISTING_FEE',
        userId: 'user-3',
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      }
    })

    if (listingFeeTx) {
      console.log('\nListing Fee Transaction (Non-Premium User):')
      console.log('  Amount: ₹', listingFeeTx.amount)
      console.log('  Description:', listingFeeTx.description)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkNewHighValueCommission()