const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPremiumBenefits() {
  try {
    // Check the latest listing (should be the premium user's listing)
    const latestListing = await prisma.listing.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true
      }
    })

    console.log('Latest Listing (Premium User):')
    console.log('  Title:', latestListing.title)
    console.log('  User:', latestListing.user.name)
    console.log('  User Premium Status:', latestListing.user.isPremium)

    // Check if there was a listing fee transaction for this listing
    const listingFeeTransaction = await prisma.transaction.findFirst({
      where: {
        type: 'LISTING_FEE',
        userId: 'user-2',
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Recent Listing Fee Transaction for User-2:')
    if (listingFeeTransaction) {
      console.log('  Amount:', listingFeeTransaction.amount)
      console.log('  Description:', listingFeeTransaction.description)
    } else {
      console.log('  No listing fee transaction found (as expected for premium user)')
    }

    // Test contact unlock for premium user (should be free)
    console.log('\n--- Testing Free Contact Unlock for Premium User ---')
    
    // Try to unlock contact for a listing they don't own
    const contactUnlockTransaction = await prisma.transaction.findFirst({
      where: {
        type: 'CONTACT_UNLOCK',
        userId: 'user-2',
        amount: 0, // Should be free for premium users
        createdAt: {
          gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (contactUnlockTransaction) {
      console.log('Free Contact Unlock Transaction Found:')
      console.log('  Amount:', contactUnlockTransaction.amount)
      console.log('  Description:', contactUnlockTransaction.description)
    } else {
      console.log('No free contact unlock transaction found in recent period')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPremiumBenefits()