const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testWalletSystem() {
  try {
    console.log('🧪 COMPREHENSIVE WALLET SYSTEM TEST')
    console.log('=' * 60)

    // Test users
    const testUsers = [
      { id: 'user-5', name: 'Regular User', initialBalance: 0 },
      { id: 'user-6', name: 'Premium User', initialBalance: 0 }
    ]

    let allTestsPassed = true
    const testResults = []

    for (const testUser of testUsers) {
      console.log(`\n📋 Testing Wallet for ${testUser.name}:`)
      console.log('-' * 50)

      const userTests = {
        walletCreation: false,
        addMoney: false,
        insufficientBalance: false,
        transactionHistory: false,
        creditTransaction: false,
        debitTransaction: false,
        refundTransaction: false,
        balanceAccuracy: false
      }

      try {
        // Test 1: Wallet Creation
        console.log('1. Testing Wallet Creation...')
        let wallet = await prisma.wallet.findUnique({
          where: { userId: testUser.id }
        })

        if (!wallet) {
          wallet = await prisma.wallet.create({
            data: {
              userId: testUser.id,
              balance: testUser.initialBalance
            }
          })
          console.log('   ✅ Wallet created successfully')
        } else {
          console.log('   ✅ Wallet already exists')
        }
        userTests.walletCreation = true

        // Test 2: Add Money (Credit)
        console.log('\n2. Testing Add Money (Credit Transaction)...')
        const addAmount = 1000
        const addResponse = await fetch('http://localhost:3000/api/wallet/add-money', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: testUser.id,
            amount: addAmount,
            paymentMethod: 'UPI'
          })
        })

        const addData = await addResponse.json()
        if (addData.success) {
          console.log(`   ✅ Money added successfully: ₹${addAmount}`)
          userTests.addMoney = true
        } else {
          console.log(`   ❌ Failed to add money: ${addData.message}`)
        }

        // Test 3: Check Balance After Credit
        console.log('\n3. Testing Balance Accuracy After Credit...')
        const updatedWallet = await prisma.wallet.findUnique({
          where: { userId: testUser.id },
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        })

        if (updatedWallet.balance === addAmount) {
          console.log(`   ✅ Balance correct after credit: ₹${updatedWallet.balance}`)
          userTests.balanceAccuracy = true
        } else {
          console.log(`   ❌ Balance incorrect. Expected: ₹${addAmount}, Got: ₹${updatedWallet.balance}`)
        }

        // Test 4: Transaction History
        console.log('\n4. Testing Transaction History...')
        const walletWithHistory = await fetch(`http://localhost:3000/api/wallet?userId=${testUser.id}`)
        const historyData = await walletWithHistory.json()

        if (historyData.success && historyData.wallet.transactions.length > 0) {
          console.log(`   ✅ Transaction history available: ${historyData.wallet.transactions.length} transactions`)
          userTests.transactionHistory = true

          // Check credit transaction
          const creditTx = historyData.wallet.transactions.find(tx => tx.type === 'CREDIT')
          if (creditTx && creditTx.amount === addAmount) {
            console.log(`   ✅ Credit transaction recorded correctly`)
            userTests.creditTransaction = true
          } else {
            console.log(`   ❌ Credit transaction not found or incorrect`)
          }
        } else {
          console.log(`   ❌ No transaction history found`)
        }

        // Test 5: Debit Transaction (Sufficient Balance)
        console.log('\n5. Testing Debit Transaction (Sufficient Balance)...')
        const debitAmount = 250
        const debitResponse = await fetch('http://localhost:3000/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: testUser.id,
            type: 'DEBIT',
            amount: debitAmount,
            description: 'Test debit transaction',
            referenceType: 'TEST_DEBIT'
          })
        })

        const debitData = await debitResponse.json()
        if (debitData.success) {
          console.log(`   ✅ Debit transaction successful: ₹${debitAmount}`)
          userTests.debitTransaction = true

          // Check balance after debit
          const finalWallet = await prisma.wallet.findUnique({
            where: { userId: testUser.id }
          })
          const expectedBalance = addAmount - debitAmount
          if (finalWallet.balance === expectedBalance) {
            console.log(`   ✅ Balance correct after debit: ₹${finalWallet.balance}`)
          } else {
            console.log(`   ❌ Balance incorrect after debit. Expected: ₹${expectedBalance}, Got: ₹${finalWallet.balance}`)
          }
        } else {
          console.log(`   ❌ Debit transaction failed: ${debitData.message}`)
        }

        // Test 6: Insufficient Balance
        console.log('\n6. Testing Insufficient Balance Handling...')
        const largeAmount = 10000
        const insufficientResponse = await fetch('http://localhost:3000/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: testUser.id,
            type: 'DEBIT',
            amount: largeAmount,
            description: 'Test insufficient balance',
            referenceType: 'TEST_INSUFFICIENT'
          })
        })

        const insufficientData = await insufficientResponse.json()
        if (!insufficientData.success && insufficientData.message.includes('Insufficient balance')) {
          console.log(`   ✅ Insufficient balance handled correctly`)
          userTests.insufficientBalance = true
        } else {
          console.log(`   ❌ Insufficient balance not handled properly`)
        }

        // Test 7: Refund Transaction
        console.log('\n7. Testing Refund Transaction...')
        const refundAmount = 100
        const refundResponse = await fetch('http://localhost:3000/api/wallet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: testUser.id,
            type: 'REFUND',
            amount: refundAmount,
            description: 'Test refund transaction',
            referenceType: 'TEST_REFUND'
          })
        })

        const refundData = await refundResponse.json()
        if (refundData.success) {
          console.log(`   ✅ Refund transaction successful: ₹${refundAmount}`)
          userTests.refundTransaction = true
        } else {
          console.log(`   ❌ Refund transaction failed: ${refundData.message}`)
        }

        // Test 8: Final Balance Verification
        console.log('\n8. Testing Final Balance Verification...')
        const finalWalletCheck = await prisma.wallet.findUnique({
          where: { userId: testUser.id },
          include: {
            transactions: {
              orderBy: { createdAt: 'desc' },
              take: 10
            }
          }
        })

        const expectedFinalBalance = addAmount - debitAmount + refundAmount
        if (finalWalletCheck.balance === expectedFinalBalance) {
          console.log(`   ✅ Final balance correct: ₹${finalWalletCheck.balance}`)
          userTests.balanceAccuracy = true
        } else {
          console.log(`   ❌ Final balance incorrect. Expected: ₹${expectedFinalBalance}, Got: ₹${finalWalletCheck.balance}`)
        }

      } catch (error) {
        console.error(`   ❌ Error testing ${testUser.name}:`, error.message)
      }

      // Calculate test results for this user
      const passedTests = Object.values(userTests).filter(Boolean).length
      const totalTests = Object.keys(userTests).length
      const userTestPassRate = (passedTests / totalTests) * 100

      console.log(`\n📊 ${testUser.name} Test Results:`)
      console.log(`   Passed: ${passedTests}/${totalTests} (${userTestPassRate.toFixed(1)}%)`)
      
      Object.entries(userTests).forEach(([test, passed]) => {
        console.log(`   ${test}: ${passed ? '✅' : '❌'}`)
      })

      testResults.push({
        user: testUser.name,
        passed: passedTests,
        total: totalTests,
        passRate: userTestPassRate
      })

      if (userTestPassRate < 100) {
        allTestsPassed = false
      }
    }

    // System-wide analysis
    console.log('\n🔍 SYSTEM-WIDE WALLET ANALYSIS:')
    console.log('-' * 50)

    // Check all wallets
    const allWallets = await prisma.wallet.findMany({
      include: {
        user: {
          select: { name: true, isPremium: true }
        },
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    console.log(`Total Wallets: ${allWallets.length}`)

    let totalBalance = 0
    let totalTransactions = 0

    allWallets.forEach((wallet, index) => {
      totalBalance += wallet.balance
      totalTransactions += wallet.transactions.length
      
      console.log(`\n${index + 1}. ${wallet.user.name} (Premium: ${wallet.user.isPremium ? 'Yes' : 'No'})`)
      console.log(`   Balance: ₹${wallet.balance}`)
      console.log(`   Transactions: ${wallet.transactions.length}`)
      console.log(`   Wallet Active: ${wallet.isActive ? 'Yes' : 'No'}`)
    })

    console.log(`\n💰 System Totals:`)
    console.log(`   Total Balance Across All Wallets: ₹${totalBalance}`)
    console.log(`   Total Transactions: ${totalTransactions}`)

    // Transaction type analysis
    const allWalletTransactions = await prisma.walletTransaction.findMany({
      include: {
        wallet: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const transactionTypes = {}
    allWalletTransactions.forEach(tx => {
      transactionTypes[tx.type] = (transactionTypes[tx.type] || 0) + 1
    })

    console.log(`\n📈 Transaction Type Distribution:`)
    Object.entries(transactionTypes).forEach(([type, count]) => {
      console.log(`   ${type}: ${count} transactions`)
    })

    // Final summary
    console.log('\n📋 FINAL TEST SUMMARY:')
    console.log('-' * 50)
    
    testResults.forEach(result => {
      console.log(`${result.user}: ${result.passed}/${result.total} tests passed (${result.passRate.toFixed(1)}%)`)
    })

    const overallPassed = testResults.reduce((sum, result) => sum + result.passed, 0)
    const overallTotal = testResults.reduce((sum, result) => sum + result.total, 0)
    const overallPassRate = (overallPassed / overallTotal) * 100

    console.log(`\n🎯 Overall System Performance:`)
    console.log(`   Total Tests: ${overallTotal}`)
    console.log(`   Passed: ${overallPassed}`)
    console.log(`   Failed: ${overallTotal - overallPassed}`)
    console.log(`   Success Rate: ${overallPassRate.toFixed(1)}%`)
    console.log(`   System Status: ${allTestsPassed ? '✅ READY FOR PRODUCTION' : '⚠️ NEEDS ATTENTION'}`)

    if (allTestsPassed) {
      console.log('\n🎉 WALLET SYSTEM IS WORKING PERFECTLY!')
      console.log('✅ All wallet operations functioning correctly')
      console.log('✅ Balance calculations are accurate')
      console.log('✅ Transaction history is properly maintained')
      console.log('✅ Error handling works as expected')
      console.log('✅ Integration with payment methods successful')
    } else {
      console.log('\n⚠️ SOME WALLET SYSTEM ISSUES DETECTED')
      console.log('Please review the failed tests above')
    }

  } catch (error) {
    console.error('❌ Critical error in wallet system test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the test
testWalletSystem()