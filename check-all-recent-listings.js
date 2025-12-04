const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAllRecentListings() {
  try {
    // Get all recent listings
    const recentListings = await prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: { name: true, isPremium: true }
        },
        categoryRelation: {
          select: { name: true }
        }
      }
    })

    console.log('Recent Listings:')
    recentListings.forEach((listing, index) => {
      const isServiceCategory = listing.category.startsWith('services-')
      console.log(`${index + 1}. ${listing.title}`)
      console.log(`   Category: ${listing.category} (${listing.categoryRelation.name})`)
      console.log(`   User: ${listing.user.name} (Premium: ${listing.user.isPremium})`)
      console.log(`   Is Service Category: ${isServiceCategory}`)
      console.log(`   Created: ${listing.createdAt.toISOString()}`)
      console.log('')
    })

    // Check transactions for the specific user who created the service listing
    const userTransactions = await prisma.transaction.findMany({
      where: {
        userId: 'user-5',
        createdAt: {
          gte: new Date(Date.now() - 10 * 60 * 1000) // Last 10 minutes
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Transactions for User-5 (Vikram Singh):')
    userTransactions.forEach((tx, index) => {
      console.log(`${index + 1}. ${tx.type} - ₹${tx.amount} - ${tx.description}`)
      console.log(`   Time: ${tx.createdAt.toISOString()}`)
      console.log('')
    })

    // Check if there are any SERVICE_MARKETPLACE_FEE transactions in the system
    const serviceFees = await prisma.transaction.findMany({
      where: { type: 'SERVICE_MARKETPLACE_FEE' },
      include: {
        user: {
          select: { name: true }
        },
        listing: {
          select: { title: true, category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('All Service Marketplace Fee Transactions in System:')
    if (serviceFees.length === 0) {
      console.log('  No service marketplace fee transactions found')
    } else {
      serviceFees.forEach((tx, index) => {
        console.log(`${index + 1}. ${tx.listing.title}`)
        console.log(`   User: ${tx.user.name}`)
        console.log(`   Fee: ₹${tx.amount}`)
        console.log(`   Category: ${tx.listing.category}`)
        console.log(`   Time: ${tx.createdAt.toISOString()}`)
        console.log('')
      })
    }

    // Test the service fee logic manually
    console.log('Service Fee Logic Test:')
    const testCategories = [
      'services-design',
      'services-tutoring', 
      'services-assignments',
      'Assignments Typing',
      'notes-handwritten'
    ]

    testCategories.forEach(cat => {
      const shouldChargeFee = cat.startsWith('services-')
      console.log(`  ${cat}: ${shouldChargeFee ? '₹15 fee' : 'No additional fee'}`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAllRecentListings()