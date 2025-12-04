const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function comprehensiveServiceFeeTest() {
  try {
    console.log('🧪 COMPREHENSIVE SERVICE MARKETPLACE FEE TEST')
    console.log('=' * 60)

    // Test both regular and premium users
    const testUsers = [
      { id: 'user-5', name: 'Regular User', expectedPremium: false },
      { id: 'user-6', name: 'Premium User', expectedPremium: true }
    ]

    let allTestsPassed = true

    for (const testUser of testUsers) {
      console.log(`\n📋 Testing ${testUser.name}:`)
      console.log('-' * 40)

      // Get user details
      const user = await prisma.user.findUnique({
        where: { id: testUser.id },
        include: {
          listings: {
            where: {
              category: {
                startsWith: 'services-'
              }
            },
            include: {
              categoryRelation: true,
              transactions: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      })

      if (!user) {
        console.log(`❌ User ${testUser.name} not found`)
        allTestsPassed = false
        continue
      }

      console.log(`User Premium Status: ${user.isPremium ? '✅ Premium' : '📝 Regular'}`)
      console.log(`Premium Expires: ${user.premiumExpires || 'N/A'}`)

      const isActuallyPremium = user.isPremium && user.premiumExpires && new Date(user.premiumExpires) > new Date()
      
      if (isActuallyPremium !== testUser.expectedPremium) {
        console.log(`❌ Premium status mismatch: Expected ${testUser.expectedPremium}, Got ${isActuallyPremium}`)
        allTestsPassed = false
      }

      const serviceListing = user.listings[0]
      if (!serviceListing) {
        console.log(`❌ No service listing found for ${testUser.name}`)
        allTestsPassed = false
        continue
      }

      console.log(`Service Listing: ${serviceListing.title}`)
      console.log(`Category: ${serviceListing.categoryRelation.name}`)
      console.log(`Price: ₹${serviceListing.price}`)

      // Check transactions
      const transactions = serviceListing.transactions
      const listingFee = transactions.find(tx => tx.type === 'LISTING_FEE')
      const serviceFee = transactions.find(tx => tx.type === 'SERVICE_MARKETPLACE_FEE')

      // Calculate expected fees
      const expectedListingFee = isActuallyPremium ? 0 : 10
      const expectedServiceFee = isActuallyPremium ? 0 : 15
      const totalExpectedFees = expectedListingFee + expectedServiceFee

      // Calculate actual fees
      const actualListingFee = listingFee ? listingFee.amount : 0
      const actualServiceFee = serviceFee ? serviceFee.amount : 0
      const totalActualFees = actualListingFee + actualServiceFee

      console.log(`\n💰 Fee Analysis:`)
      console.log(`   Expected Listing Fee: ₹${expectedListingFee}`)
      console.log(`   Expected Service Fee: ₹${expectedServiceFee}`)
      console.log(`   Total Expected Fees: ₹${totalExpectedFees}`)
      console.log(`   Actual Listing Fee: ₹${actualListingFee}`)
      console.log(`   Actual Service Fee: ₹${actualServiceFee}`)
      console.log(`   Total Actual Fees: ₹${totalActualFees}`)

      // Verify fees
      const listingFeeCorrect = actualListingFee === expectedListingFee
      const serviceFeeCorrect = actualServiceFee === expectedServiceFee
      const totalFeesCorrect = totalActualFees === totalExpectedFees

      console.log(`\n✅ Verification:`)
      console.log(`   Listing Fee Correct: ${listingFeeCorrect ? '✅ YES' : '❌ NO'}`)
      console.log(`   Service Fee Correct: ${serviceFeeCorrect ? '✅ YES' : '❌ NO'}`)
      console.log(`   Total Fees Correct: ${totalFeesCorrect ? '✅ YES' : '❌ NO'}`)

      if (!listingFeeCorrect || !serviceFeeCorrect || !totalFeesCorrect) {
        allTestsPassed = false
      }

      console.log(`\n📊 Transaction Details:`)
      if (listingFee) {
        console.log(`   Listing Fee: ₹${listingFee.amount} - ${listingFee.description}`)
      } else {
        console.log(`   No Listing Fee Transaction Found`)
      }

      if (serviceFee) {
        console.log(`   Service Fee: ₹${serviceFee.amount} - ${serviceFee.description}`)
      } else {
        console.log(`   No Service Fee Transaction Found ${isActuallyPremium ? '(Expected for Premium)' : '(❌ Should exist for Regular)'}`)
      }
    }

    // Overall system check
    console.log('\n🔍 SYSTEM-WIDE SERVICE FEE ANALYSIS:')
    console.log('-' * 50)

    const allServiceFees = await prisma.transaction.findMany({
      where: { type: 'SERVICE_MARKETPLACE_FEE' },
      include: {
        user: {
          select: { name: true, isPremium: true, premiumExpires: true }
        },
        listing: {
          select: { title: true, category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Total Service Fee Transactions: ${allServiceFees.length}`)

    let correctFees = 0
    let incorrectFees = 0

    allServiceFees.forEach((tx, index) => {
      const isPremiumUser = tx.user.isPremium && tx.user.premiumExpires && new Date(tx.user.premiumExpires) > new Date()
      const expectedFee = isPremiumUser ? 0 : 15
      const feeCorrect = tx.amount === expectedFee

      console.log(`\n${index + 1}. ${tx.listing.title}`)
      console.log(`   User: ${tx.user.name} (Premium: ${isPremiumUser})`)
      console.log(`   Fee: ₹${tx.amount} (Expected: ₹${expectedFee}) - ${feeCorrect ? '✅' : '❌'}`)

      if (feeCorrect) {
        correctFees++
      } else {
        incorrectFees++
      }
    })

    console.log(`\n📈 SUMMARY:`)
    console.log(`   Correct Service Fees: ${correctFees}`)
    console.log(`   Incorrect Service Fees: ${incorrectFees}`)
    console.log(`   All Tests Passed: ${allTestsPassed ? '✅ YES' : '❌ NO'}`)

    if (allTestsPassed && incorrectFees === 0) {
      console.log('\n🎉 SERVICE MARKETPLACE FEE SYSTEM IS WORKING PERFECTLY!')
      console.log('✅ Regular users are charged ₹15 for service listings')
      console.log('✅ Premium users get service fees waived')
      console.log('✅ Listing fees work correctly (₹10 for regular, ₹0 for premium)')
    } else {
      console.log('\n⚠️  SOME ISSUES FOUND IN SERVICE MARKETPLACE FEE SYSTEM')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

comprehensiveServiceFeeTest()