const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkServiceMarketplaceFee() {
  try {
    // Get the latest service listing
    const latestListing = await prisma.listing.findFirst({
      where: {
        category: {
          startsWith: 'services-'
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        categoryRelation: true
      }
    })

    console.log('Latest Service Marketplace Listing:')
    console.log('  Title:', latestListing.title)
    console.log('  Price: ₹', latestListing.price)
    console.log('  Category:', latestListing.category)
    console.log('  Category Name:', latestListing.categoryRelation.name)
    console.log('  User:', latestListing.user.name)
    console.log('  User Premium:', latestListing.user.isPremium)

    // Check if this is a service category
    const isServiceCategory = latestListing.category.startsWith('services-') || 
                              latestListing.categoryRelation.name.toLowerCase().includes('service') ||
                              latestListing.categoryRelation.name.toLowerCase().includes('typing')

    console.log('  Is Service Category:', isServiceCategory)

    // Get recent transactions for this listing's user
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId: latestListing.userId,
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\nRecent Transactions for', latestListing.user.name + ':')
    let listingFeeFound = false
    let serviceFeeFound = false

    recentTransactions.forEach((tx, index) => {
      console.log(`${index + 1}. Type: ${tx.type}`)
      console.log(`   Amount: ₹${tx.amount}`)
      console.log(`   Description: ${tx.description}`)
      console.log(`   Time: ${tx.createdAt.toISOString()}`)

      if (tx.type === 'LISTING_FEE') {
        listingFeeFound = true
        console.log(`   ✅ Listing fee charged (₹${tx.amount})`)
      } else if (tx.type === 'SERVICE_MARKETPLACE_FEE') {
        serviceFeeFound = true
        console.log(`   ✅ Service marketplace fee charged (₹${tx.amount})`)
      }
      console.log('')
    })

    // Calculate expected fees
    const user = latestListing.user
    const isPremium = user.isPremium && user.premiumExpires && new Date(user.premiumExpires) > new Date()
    
    const expectedListingFee = isPremium ? 0 : 10
    const expectedServiceFee = isServiceCategory && !isPremium ? 15 : 0
    const totalExpectedFees = expectedListingFee + expectedServiceFee

    console.log('Fee Analysis:')
    console.log('  User Premium:', isPremium)
    console.log('  Is Service Category:', isServiceCategory)
    console.log('  Expected Listing Fee: ₹', expectedListingFee)
    console.log('  Expected Service Fee: ₹', expectedServiceFee)
    console.log('  Total Expected Fees: ₹', totalExpectedFees)

    // Verify fees were charged correctly
    const actualFees = recentTransactions
      .filter(tx => ['LISTING_FEE', 'SERVICE_MARKETPLACE_FEE'].includes(tx.type))
      .reduce((sum, tx) => sum + tx.amount, 0)

    console.log('  Actual Fees Charged: ₹', actualFees)
    console.log('  Fees Correct:', actualFees === totalExpectedFees ? '✅ YES' : '❌ NO')

    // Check all service marketplace transactions in the system
    const allServiceFees = await prisma.transaction.findMany({
      where: { type: 'SERVICE_MARKETPLACE_FEE' },
      include: {
        user: {
          select: { name: true, isPremium: true }
        },
        listing: {
          select: { title: true, category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\nAll Service Marketplace Fee Transactions:')
    allServiceFees.forEach((tx, index) => {
      const isPremiumUser = tx.user.isPremium
      const expectedFee = isPremiumUser ? 0 : 15
      const feeCorrect = tx.amount === expectedFee

      console.log(`${index + 1}. ${tx.listing.title}`)
      console.log(`   User: ${tx.user.name} (Premium: ${isPremiumUser})`)
      console.log(`   Fee: ₹${tx.amount} (Expected: ₹${expectedFee}) - ${feeCorrect ? '✅' : '❌'}`)
      console.log('')
    })

    if (actualFees === totalExpectedFees) {
      console.log('✅ SERVICE MARKETPLACE FEE SYSTEM WORKING CORRECTLY!')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkServiceMarketplaceFee()