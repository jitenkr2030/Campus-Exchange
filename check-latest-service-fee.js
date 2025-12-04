const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkLatestServiceFee() {
  try {
    // Get the absolute latest listing
    const latestListing = await prisma.listing.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        categoryRelation: true
      }
    })

    console.log('Latest Listing:')
    console.log('  Title:', latestListing.title)
    console.log('  Category:', latestListing.category)
    console.log('  Category Name:', latestListing.categoryRelation.name)
    console.log('  User:', latestListing.user.name)
    console.log('  User Premium:', latestListing.user.isPremium)
    console.log('  Created:', latestListing.createdAt.toISOString())

    // Check if this is a service category (starts with 'services-')
    const isServiceCategory = latestListing.category.startsWith('services-')
    console.log('  Is Service Category (starts with services-):', isServiceCategory)

    // Get all transactions for this user in the last 2 minutes
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        userId: latestListing.userId,
        createdAt: {
          gte: new Date(Date.now() - 2 * 60 * 1000) // Last 2 minutes
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\nRecent Transactions for', latestListing.user.name + ':')
    let listingFeeFound = false
    let serviceFeeFound = false
    let totalFees = 0

    recentTransactions.forEach((tx, index) => {
      console.log(`${index + 1}. Type: ${tx.type}`)
      console.log(`   Amount: ₹${tx.amount}`)
      console.log(`   Description: ${tx.description}`)
      console.log(`   Time: ${tx.createdAt.toISOString()}`)

      if (tx.type === 'LISTING_FEE') {
        listingFeeFound = true
        totalFees += tx.amount
        console.log(`   ✅ Listing fee charged (₹${tx.amount})`)
      } else if (tx.type === 'SERVICE_MARKETPLACE_FEE') {
        serviceFeeFound = true
        totalFees += tx.amount
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
    console.log('  Actual Fees Charged: ₹', totalFees)
    console.log('  Fees Correct:', totalFees === totalExpectedFees ? '✅ YES' : '❌ NO')

    // Check if we need to look at a broader time range
    if (totalFees === 0) {
      console.log('\nChecking broader time range (last 10 minutes)...')
      
      const broaderTransactions = await prisma.transaction.findMany({
        where: {
          userId: latestListing.userId,
          createdAt: {
            gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      console.log('Found', broaderTransactions.length, 'transactions in broader time range:')
      broaderTransactions.forEach((tx, index) => {
        console.log(`${index + 1}. ${tx.type} - ₹${tx.amount} - ${tx.description}`)
      })
    }

    if (totalFees === totalExpectedFees && totalFees > 0) {
      console.log('\n✅ SERVICE MARKETPLACE FEE SYSTEM WORKING CORRECTLY!')
    } else if (isServiceCategory && totalFees === expectedListingFee) {
      console.log('\n❌ Service fee not charged, but listing fee was charged')
    } else if (!isServiceCategory && totalFees === expectedListingFee) {
      console.log('\nℹ️  Not a service category, only listing fee charged (correct)')
    } else {
      console.log('\n❌ Service marketplace fee system not working as expected')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkLatestServiceFee()