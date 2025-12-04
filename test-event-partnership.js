const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkEventPartnership() {
  try {
    // Get the latest event partnership transaction
    const partnershipTx = await prisma.transaction.findFirst({
      where: { type: 'EVENT_PARTNERSHIP' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        event: true
      }
    })

    console.log('Event Partnership Transaction:')
    console.log('  Amount: ₹', partnershipTx.amount)
    console.log('  Type:', partnershipTx.type)
    console.log('  Status:', partnershipTx.status)
    console.log('  Description:', partnershipTx.description)
    console.log('  User:', partnershipTx.user.name)
    console.log('  Event:', partnershipTx.event.title)

    // Check the event details
    const event = await prisma.event.findUnique({
      where: { id: partnershipTx.eventId }
    })

    console.log('\nEvent Status After Partnership:')
    console.log('  Title:', event.title)
    console.log('  isPartnered:', event.isPartnered)
    console.log('  partnershipFee: ₹', event.partnershipFee)

    // Verify the fee amount based on sponsorship level
    const sponsorshipLevel = partnershipTx.description.includes('GOLD') ? 'GOLD' :
                              partnershipTx.description.includes('PLATINUM') ? 'PLATINUM' :
                              partnershipTx.description.includes('SILVER') ? 'SILVER' :
                              partnershipTx.description.includes('BRONZE') ? 'BRONZE' : 'UNKNOWN'

    const expectedFees = {
      'PLATINUM': 5000,
      'GOLD': 3000,
      'SILVER': 1500,
      'BRONZE': 500
    }

    const expectedFee = expectedFees[sponsorshipLevel] || 1000
    const actualFee = partnershipTx.amount
    const isCorrectFee = actualFee === expectedFee

    console.log('\nPartnership Fee Verification:')
    console.log('  Sponsorship Level:', sponsorshipLevel)
    console.log('  Expected Fee: ₹', expectedFee)
    console.log('  Actual Fee: ₹', actualFee)
    console.log('  Fee Correct:', isCorrectFee ? '✅ YES' : '❌ NO')

    // Check all event partnership transactions
    const allPartnershipTxs = await prisma.transaction.findMany({
      where: { type: 'EVENT_PARTNERSHIP' },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
        },
        event: {
          select: { title: true, isPartnered: true, partnershipFee: true }
        }
      }
    })

    console.log('\nAll Event Partnership Transactions:')
    allPartnershipTxs.forEach((tx, index) => {
      const level = tx.description.includes('GOLD') ? 'GOLD' :
                   tx.description.includes('PLATINUM') ? 'PLATINUM' :
                   tx.description.includes('SILVER') ? 'SILVER' :
                   tx.description.includes('BRONZE') ? 'BRONZE' : 'UNKNOWN'
      
      const expectedFee = expectedFees[level] || 1000
      const feeCorrect = tx.amount === expectedFee
      const partneredCorrect = tx.event.isPartnered

      console.log(`${index + 1}. ${tx.event.title}`)
      console.log(`   Sponsor: ${tx.user.name}`)
      console.log(`   Level: ${level}`)
      console.log(`   Fee: ₹${tx.amount} (Expected: ₹${expectedFee}) - ${feeCorrect ? '✅' : '❌'}`)
      console.log(`   Partnered: ${tx.event.isPartnered} - ${partneredCorrect ? '✅' : '❌'}`)
      console.log('')
    })

    // Test all sponsorship levels
    console.log('Sponsorship Level Fee Structure:')
    Object.entries(expectedFees).forEach(([level, fee]) => {
      console.log(`  ${level}: ₹${fee}`)
    })

    if (isCorrectFee && event.isPartnered) {
      console.log('\n✅ EVENT PARTNERSHIPS SYSTEM WORKING CORRECTLY!')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEventPartnership()