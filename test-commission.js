const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCommissionSystem() {
  try {
    // Check the high-value MacBook Pro listing
    const macbookListing = await prisma.listing.findUnique({
      where: { id: 'listing-7' },
      include: {
        user: true,
        transactions: {
          where: {
            type: 'HIGH_VALUE_COMMISSION'
          }
        }
      }
    })

    console.log('High-Value Listing (MacBook Pro):')
    console.log('  Title:', macbookListing.title)
    console.log('  Price: ₹', macbookListing.price)
    console.log('  Owner:', macbookListing.user.name)
    console.log('  Owner Premium:', macbookListing.user.isPremium)

    // Check commission transaction
    if (macbookListing.transactions.length > 0) {
      const commissionTx = macbookListing.transactions[0]
      console.log('\nCommission Transaction:')
      console.log('  Amount: ₹', commissionTx.amount)
      console.log('  Rate:', commissionTx.commissionRate, '%')
      console.log('  Status:', commissionTx.status)
      console.log('  Description:', commissionTx.description)

      // Verify commission calculation
      const expectedRate = macbookListing.price > 50000 ? 5 : 
                           macbookListing.price > 20000 ? 4 :
                           macbookListing.price > 10000 ? 3 :
                           macbookListing.price > 5000 ? 2 : 0
      
      const expectedAmount = (macbookListing.price * expectedRate) / 100
      const actualAmount = commissionTx.amount
      const isCorrect = Math.abs(actualAmount - expectedAmount) < 0.01

      console.log('\nCommission Verification:')
      console.log('  Expected Rate:', expectedRate, '%')
      console.log('  Expected Amount: ₹', expectedAmount)
      console.log('  Actual Amount: ₹', actualAmount)
      console.log('  Calculation Correct:', isCorrect ? '✅ YES' : '❌ NO')
    } else {
      console.log('\n❌ No commission transaction found for high-value item!')
    }

    // Test creating a new high-value listing to verify commission calculation
    console.log('\n--- Testing New High-Value Listing Creation ---')
    
    // Check different price tiers
    const testPrices = [6000, 15000, 25000, 75000] // Different commission tiers
    
    testPrices.forEach(price => {
      const expectedRate = price > 50000 ? 5 : 
                           price > 20000 ? 4 :
                           price > 10000 ? 3 :
                           price > 5000 ? 2 : 0
      
      const expectedCommission = (price * expectedRate) / 100
      
      console.log(`\nPrice: ₹${price}`)
      console.log(`  Expected Commission Rate: ${expectedRate}%`)
      console.log(`  Expected Commission Amount: ₹${expectedCommission}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCommissionSystem()