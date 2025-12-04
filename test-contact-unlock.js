const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkContactUnlock() {
  try {
    // Check the latest contact unlock transaction
    const contactUnlockTransaction = await prisma.transaction.findFirst({
      where: { type: 'CONTACT_UNLOCK' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        listing: true
      }
    })

    console.log('Contact Unlock Transaction:', contactUnlockTransaction)

    // Check if the listing contact was unlocked
    const listing = await prisma.listing.findUnique({
      where: { id: 'listing-7' },
      include: {
        user: true
      }
    })

    console.log('Listing Contact Info:', {
      listingId: listing.id,
      title: listing.title,
      owner: {
        name: listing.user.name,
        phone: listing.user.phone,
        email: listing.user.email
      },
      contactUnlocked: listing.contactUnlocked
    })

    // Check user-2's premium status
    const user = await prisma.user.findUnique({
      where: { id: 'user-2' }
    })

    console.log('User-2 Premium Status:', user.isPremium)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkContactUnlock()