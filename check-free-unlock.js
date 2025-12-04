const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkFreeContactUnlock() {
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

    // Check the latest contact unlock transaction for user-2
    const contactUnlockTx = await prisma.transaction.findFirst({
      where: {
        type: 'CONTACT_UNLOCK',
        userId: 'user-2'
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\nLatest Contact Unlock Transaction:')
    console.log('  Amount:', contactUnlockTx.amount)
    console.log('  Status:', contactUnlockTx.status)
    console.log('  Description:', contactUnlockTx.description)
    console.log('  Time:', contactUnlockTx.createdAt.toISOString())

    const isAfterPremium = contactUnlockTx.createdAt > premiumTime
    console.log('  After Premium:', isAfterPremium)
    
    if (isAfterPremium) {
      const isFree = contactUnlockTx.amount === 0
      console.log('  Free for Premium:', isFree)
      if (isFree) {
        console.log('✅ PREMIUM CONTACT UNLOCK BENEFIT WORKING!')
      } else {
        console.log('❌ ERROR: Still charging for contact unlock after premium!')
      }
    } else {
      console.log('  This was before premium subscription')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkFreeContactUnlock()