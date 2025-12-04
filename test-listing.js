const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkListingCreation() {
  try {
    // Check the latest listing
    const latestListing = await prisma.listing.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        categoryRelation: true
      }
    })

    console.log('Latest Listing:', latestListing)

    // Check the latest transaction
    const latestTransaction = await prisma.transaction.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true
      }
    })

    console.log('Latest Transaction:', latestTransaction)

    // Check if user-2 is premium
    const user = await prisma.user.findUnique({
      where: { id: 'user-2' }
    })

    console.log('User-2 Premium Status:', user.isPremium, user.premiumExpires)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkListingCreation()