import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo data for service marketplace fee testing...')

  // Create campus
  const campus = await prisma.campus.upsert({
    where: { id: 'campus-1' },
    update: {},
    create: {
      id: 'campus-1',
      name: 'Demo University',
      address: '123 University Ave',
      city: 'Demo City',
      state: 'Demo State',
      isActive: true
    }
  })

  console.log('Campus created/updated:', campus.name)

  // Create service category
  const serviceCategory = await prisma.category.upsert({
    where: { id: 'services-assignments' },
    update: {},
    create: {
      id: 'services-assignments',
      name: 'Assignments Typing',
      description: 'Typing and formatting services for assignments',
      icon: 'Type',
      color: 'bg-blue-100 text-blue-700',
      isActive: true
    }
  })

  console.log('Service category created:', serviceCategory.name)

  // Create users
  const regularUser = await prisma.user.upsert({
    where: { id: 'user-5' },
    update: {},
    create: {
      id: 'user-5',
      phone: '+1234567890',
      name: 'Regular User',
      isVerified: true,
      isPremium: false,
      campusId: campus.id
    }
  })

  const premiumUser = await prisma.user.upsert({
    where: { id: 'user-6' },
    update: {},
    create: {
      id: 'user-6',
      phone: '+1234567891',
      name: 'Premium User',
      isVerified: true,
      isPremium: true,
      premiumExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      campusId: campus.id
    }
  })

  console.log('Users created:', regularUser.name, premiumUser.name)

  // Create service listing for regular user
  const serviceListing = await prisma.listing.create({
    data: {
      id: 'service-listing-1',
      title: 'Assignment Typing Service',
      description: 'I will type and format your assignments professionally',
      price: 50.00,
      category: 'services-assignments',
      condition: 'NEW',
      isAvailable: true,
      userId: regularUser.id,
      campusId: campus.id,
      categoryId: serviceCategory.id
    }
  })

  console.log('Service listing created:', serviceListing.title)

  // Create service listing for premium user
  const premiumServiceListing = await prisma.listing.create({
    data: {
      id: 'service-listing-2',
      title: 'Premium Assignment Typing Service',
      description: 'Premium typing and formatting service with fast delivery',
      price: 75.00,
      category: 'services-assignments',
      condition: 'NEW',
      isAvailable: true,
      userId: premiumUser.id,
      campusId: campus.id,
      categoryId: serviceCategory.id
    }
  })

  console.log('Premium service listing created:', premiumServiceListing.title)

  // Create transactions for service fees
  const regularUserTransaction = await prisma.transaction.create({
    data: {
      id: 'tx-service-fee-1',
      type: 'SERVICE_MARKETPLACE_FEE',
      amount: 15.00,
      currency: 'INR',
      status: 'COMPLETED',
      description: 'Service marketplace fee for assignment typing service',
      userId: regularUser.id,
      listingId: serviceListing.id
    }
  })

  const regularUserListingFee = await prisma.transaction.create({
    data: {
      id: 'tx-listing-fee-1',
      type: 'LISTING_FEE',
      amount: 10.00,
      currency: 'INR',
      status: 'COMPLETED',
      description: 'Listing fee for service',
      userId: regularUser.id,
      listingId: serviceListing.id
    }
  })

  console.log('Transactions created for regular user')

  // Premium user should not have service fees (only listing fee if not premium, but this user is premium)
  const premiumUserListingFee = await prisma.transaction.create({
    data: {
      id: 'tx-listing-fee-2',
      type: 'LISTING_FEE',
      amount: 0.00, // Free for premium users
      currency: 'INR',
      status: 'COMPLETED',
      description: 'Listing fee for service (waived for premium)',
      userId: premiumUser.id,
      listingId: premiumServiceListing.id
    }
  })

  console.log('Transaction created for premium user')

  console.log('Demo data seeded successfully!')
  console.log('Service marketplace fee system is ready for testing!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })