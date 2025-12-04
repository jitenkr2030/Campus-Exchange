const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkSponsoredListing() {
  try {
    // Get the latest sponsored listing transaction
    const sponsoredTx = await prisma.transaction.findFirst({
      where: { type: 'SPONSORED_LISTING' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        listing: true
      }
    })

    console.log('Sponsored Listing Transaction:')
    console.log('  Amount: ₹', sponsoredTx.amount)
    console.log('  Type:', sponsoredTx.type)
    console.log('  Status:', sponsoredTx.status)
    console.log('  Description:', sponsoredTx.description)
    console.log('  User:', sponsoredTx.user.name)
    console.log('  User Premium:', sponsoredTx.user.isPremium)
    console.log('  Listing:', sponsoredTx.listing.title)
    console.log('  Listing ID:', sponsoredTx.listing.id)

    // Verify the fee amount
    const expectedFee = sponsoredTx.user.isPremium ? 15 : 25 // Premium gets discount
    const actualFee = sponsoredTx.amount
    const isCorrectFee = actualFee === expectedFee

    console.log('\nFee Verification:')
    console.log('  User Premium:', sponsoredTx.user.isPremium)
    console.log('  Expected Fee: ₹', expectedFee)
    console.log('  Actual Fee: ₹', actualFee)
    console.log('  Fee Correct:', isCorrectFee ? '✅ YES' : '❌ NO')

    // Check if the listing is now featured
    const listing = await prisma.listing.findUnique({
      where: { id: sponsoredTx.listingId }
    })

    console.log('\nListing Status After Sponsorship:')
    console.log('  Title:', listing.title)
    console.log('  isFeatured:', listing.isFeatured)
    console.log('  Featured Status Correct:', listing.isFeatured ? '✅ YES' : '❌ NO')

    // Check all sponsored listing transactions
    const allSponsoredTxs = await prisma.transaction.findMany({
      where: { type: 'SPONSORED_LISTING' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, isPremium: true }
        },
        listing: {
          select: { title: true, isFeatured: true }
        }
      }
    })

    console.log('\nAll Sponsored Listing Transactions:')
    allSponsoredTxs.forEach((tx, index) => {
      const expectedFee = tx.user.isPremium ? 15 : 25
      const feeCorrect = tx.amount === expectedFee
      const featuredCorrect = tx.listing.isFeatured

      console.log(`${index + 1}. ${tx.listing.title}`)
      console.log(`   User: ${tx.user.name} (Premium: ${tx.user.isPremium})`)
      console.log(`   Fee: ₹${tx.amount} (Expected: ₹${expectedFee}) - ${feeCorrect ? '✅' : '❌'}`)
      console.log(`   Featured: ${tx.listing.isFeatured} - ${featuredCorrect ? '✅' : '❌'}`)
      console.log('')
    })

    if (isCorrectFee && listing.isFeatured) {
      console.log('✅ SPONSORED LISTINGS FEATURE WORKING CORRECTLY!')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSponsoredListing()