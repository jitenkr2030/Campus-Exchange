const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function investigateCommissionIssue() {
  try {
    // Get the latest listing details
    const latestListing = await prisma.listing.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        categoryRelation: true
      }
    })

    console.log('Latest Listing Details:')
    console.log('  ID:', latestListing.id)
    console.log('  Title:', latestListing.title)
    console.log('  Price: ₹', latestListing.price)
    console.log('  Category:', latestListing.category)
    console.log('  Category ID:', latestListing.categoryId)
    console.log('  Category Name:', latestListing.categoryRelation.name)
    console.log('  User:', latestListing.user.name)
    console.log('  User Premium:', latestListing.user.isPremium)

    // Check all transactions for this user
    const userTransactions = await prisma.transaction.findMany({
      where: { userId: 'user-3' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        amount: true,
        description: true,
        createdAt: true,
        listingId: true
      }
    })

    console.log('\nAll Transactions for User-3 (Amit Kumar):')
    userTransactions.forEach((tx, index) => {
      console.log(`${index + 1}. Type: ${tx.type}`)
      console.log(`   Amount: ₹${tx.amount}`)
      console.log(`   Description: ${tx.description}`)
      console.log(`   Listing ID: ${tx.listingId || 'N/A'}`)
      console.log(`   Time: ${tx.createdAt.toISOString()}`)
      console.log('')
    })

    // Check if there are any HIGH_VALUE_COMMISSION transactions in the system
    const allCommissionTxs = await prisma.transaction.findMany({
      where: { type: 'HIGH_VALUE_COMMISSION' },
      orderBy: { createdAt: 'desc' }
    })

    console.log('All High-Value Commission Transactions in System:')
    if (allCommissionTxs.length === 0) {
      console.log('  No high-value commission transactions found')
    } else {
      allCommissionTxs.forEach((tx, index) => {
        console.log(`${index + 1}. Amount: ₹${tx.amount}, Rate: ${tx.commissionRate}%, Status: ${tx.status}`)
      })
    }

    // Test the commission calculation logic manually
    const price = latestListing.price
    const expectedRate = price > 50000 ? 5 : 
                         price > 20000 ? 4 :
                         price > 10000 ? 3 :
                         price > 5000 ? 2 : 0
    
    const expectedCommission = (price * expectedRate) / 100

    console.log('\nManual Commission Calculation Test:')
    console.log('  Price: ₹', price)
    console.log('  Expected Rate:', expectedRate, '%')
    console.log('  Expected Commission: ₹', expectedCommission)
    console.log('  Should Create Commission:', price > 5000 ? 'YES' : 'NO')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

investigateCommissionIssue()