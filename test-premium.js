const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkPremiumSubscription() {
  try {
    // Check user-2's premium status after subscription
    const user = await prisma.user.findUnique({
      where: { id: 'user-2' }
    })

    console.log('User-2 Premium Status After Subscription:')
    console.log('  isPremium:', user.isPremium)
    console.log('  premiumExpires:', user.premiumExpires)

    // Check the latest premium subscription transaction
    const premiumTransaction = await prisma.transaction.findFirst({
      where: { 
        type: 'PREMIUM_SUBSCRIPTION',
        userId: 'user-2'
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Premium Subscription Transaction:')
    console.log('  Amount:', premiumTransaction.amount)
    console.log('  Status:', premiumTransaction.status)
    console.log('  Description:', premiumTransaction.description)

    // Test if user now gets free listing creation (create a test listing)
    console.log('\n--- Testing Free Listing for Premium User ---')
    
    // Check if user is currently premium
    const isCurrentlyPremium = user.isPremium && user.premiumExpires && new Date(user.premiumExpires) > new Date()
    console.log('Currently Premium:', isCurrentlyPremium)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkPremiumSubscription()