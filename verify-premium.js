const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyPremiumBenefits() {
  try {
    // Get the premium subscription time for user-2
    const premiumTx = await prisma.transaction.findFirst({
      where: {
        type: 'PREMIUM_SUBSCRIPTION',
        userId: 'user-2'
      }
    })

    const premiumTime = premiumTx.createdAt
    console.log('Premium Subscription Time:', premiumTime.toISOString())

    // Get all listings created by user-2
    const listings = await prisma.listing.findMany({
      where: { userId: 'user-2' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        title: true,
        createdAt: true
      }
    })

    console.log('\nUser-2 Listings:')
    listings.forEach((listing, index) => {
      const isAfterPremium = listing.createdAt > premiumTime
      console.log(`${index + 1}. ${listing.title}`)
      console.log(`   Created: ${listing.createdAt.toISOString()}`)
      console.log(`   After Premium: ${isAfterPremium}`)
      console.log('')
    })

    // Check for listing fees after premium subscription
    const listingFeesAfterPremium = await prisma.transaction.findMany({
      where: {
        type: 'LISTING_FEE',
        userId: 'user-2',
        createdAt: {
          gt: premiumTime
        }
      }
    })

    console.log('Listing Fees After Premium Subscription:')
    if (listingFeesAfterPremium.length === 0) {
      console.log('✅ No listing fees charged after premium subscription - BENEFIT WORKING!')
    } else {
      console.log('❌ Found listing fees after premium subscription:')
      listingFeesAfterPremium.forEach(fee => {
        console.log(`  Amount: ₹${fee.amount}, Time: ${fee.createdAt.toISOString()}`)
      })
    }

    // Test contact unlock after premium (should be free)
    const contactUnlocksAfterPremium = await prisma.transaction.findMany({
      where: {
        type: 'CONTACT_UNLOCK',
        userId: 'user-2',
        createdAt: {
          gt: premiumTime
        }
      }
    })

    console.log('\nContact Unlocks After Premium Subscription:')
    if (contactUnlocksAfterPremium.length === 0) {
      console.log('ℹ️  No contact unlocks attempted after premium subscription')
    } else {
      contactUnlocksAfterPremium.forEach(unlock => {
        const isFree = unlock.amount === 0
        console.log(`  Amount: ₹${unlock.amount}, Free: ${isFree}, Time: ${unlock.createdAt.toISOString()}`)
      })
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verifyPremiumBenefits()