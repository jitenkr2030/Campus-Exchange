const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkBusinessAdCreation() {
  try {
    // Get the latest business ad
    const latestBusinessAd = await prisma.businessAd.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        campus: true,
        transactions: true
      }
    })

    console.log('Latest Business Advertisement:')
    console.log('  Title:', latestBusinessAd.title)
    console.log('  Category:', latestBusinessAd.category)
    console.log('  Location:', latestBusinessAd.location)
    console.log('  Campus:', latestBusinessAd.campus.name)
    console.log('  Monthly Fee: ₹', latestBusinessAd.monthlyFee)
    console.log('  Start Date:', latestBusinessAd.startDate.toISOString())
    console.log('  End Date:', latestBusinessAd.endDate.toISOString())

    // Check the business ad transaction
    if (latestBusinessAd.transactions.length > 0) {
      const transaction = latestBusinessAd.transactions[0]
      console.log('\nBusiness Ad Transaction:')
      console.log('  Amount: ₹', transaction.amount)
      console.log('  Type:', transaction.type)
      console.log('  Status:', transaction.status)
      console.log('  Description:', transaction.description)

      // Verify the fee amount
      const expectedFee = 199
      const actualFee = transaction.amount
      const isCorrectFee = actualFee === expectedFee

      console.log('\nFee Verification:')
      console.log('  Expected Fee: ₹', expectedFee)
      console.log('  Actual Fee: ₹', actualFee)
      console.log('  Fee Correct:', isCorrectFee ? '✅ YES' : '❌ NO')

      if (isCorrectFee) {
        console.log('\n✅ BUSINESS ADVERTISING SYSTEM WORKING CORRECTLY!')
      }
    } else {
      console.log('\n❌ No transaction found for business ad!')
    }

    // Check the duration (should be 30 days)
    const startDate = latestBusinessAd.startDate
    const endDate = latestBusinessAd.endDate
    const durationMs = endDate - startDate
    const durationDays = Math.round(durationMs / (1000 * 60 * 60 * 24))
    
    console.log('\nDuration Verification:')
    console.log('  Start Date:', startDate.toISOString())
    console.log('  End Date:', endDate.toISOString())
    console.log('  Duration:', durationDays, 'days')
    console.log('  Duration Correct:', durationDays === 30 ? '✅ YES' : '❌ NO')

    // Check all business ads in the system
    const allBusinessAds = await prisma.businessAd.findMany({
      select: {
        id: true,
        title: true,
        monthlyFee: true,
        impressions: true,
        clicks: true,
        isActive: true
      }
    })

    console.log('\nAll Business Ads in System:')
    allBusinessAds.forEach((ad, index) => {
      console.log(`${index + 1}. ${ad.title}`)
      console.log(`   Fee: ₹${ad.monthlyFee}/month`)
      console.log(`   Impressions: ${ad.impressions}, Clicks: ${ad.clicks}`)
      console.log(`   Active: ${ad.isActive}`)
      console.log('')
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkBusinessAdCreation()