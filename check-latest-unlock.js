const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkLatestContactUnlock() {
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

    // Get all contact unlock transactions for user-2
    const contactUnlocks = await prisma.transaction.findMany({
      where: {
        type: 'CONTACT_UNLOCK',
        userId: 'user-2'
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        amount: true,
        description: true,
        createdAt: true
      }
    })

    console.log('\nAll Contact Unlock Transactions for User-2:')
    contactUnlocks.forEach((unlock, index) => {
      const isAfterPremium = unlock.createdAt > premiumTime
      const isFree = unlock.amount === 0
      console.log(`${index + 1}. Amount: ₹${unlock.amount}`)
      console.log(`   Time: ${unlock.createdAt.toISOString()}`)
      console.log(`   After Premium: ${isAfterPremium}`)
      console.log(`   Free: ${isFree}`)
      if (isAfterPremium && isFree) {
        console.log('   ✅ PREMIUM BENEFIT APPLIED!')
      } else if (isAfterPremium && !isFree) {
        console.log('   ❌ ERROR: Should be free for premium!')
      }
      console.log('')
    })

    // Check the very latest contact unlock
    const latestUnlock = contactUnlocks[0]
    if (latestUnlock) {
      const isAfterPremium = latestUnlock.createdAt > premiumTime
      const isFree = latestUnlock.amount === 0
      
      console.log('Latest Contact Unlock Analysis:')
      if (isAfterPremium && isFree) {
        console.log('✅ PREMIUM CONTACT UNLOCK BENEFIT CONFIRMED!')
        console.log('   Premium users get free contact unlocks')
      } else if (isAfterPremium && !isFree) {
        console.log('❌ ERROR: Latest contact unlock should be free for premium!')
      } else {
        console.log('ℹ️  Latest contact unlock was before premium subscription')
      }
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkLatestContactUnlock()