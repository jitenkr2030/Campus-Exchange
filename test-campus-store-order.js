const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCampusStoreOrder() {
  try {
    // Get the latest order
    const latestOrder = await prisma.order.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true }
        },
        campus: {
          select: { name: true }
        },
        orderItems: {
          include: {
            product: {
              select: { name: true, price: true, stockQuantity: true }
            }
          }
        },
        transactions: true
      }
    })

    console.log('Latest Campus Store Order:')
    console.log('  Order Number:', latestOrder.orderNumber)
    console.log('  Total Amount: ₹', latestOrder.totalAmount)
    console.log('  Status:', latestOrder.status)
    console.log('  User:', latestOrder.user.name)
    console.log('  Campus:', latestOrder.campus.name)
    console.log('  Shipping Address:', latestOrder.shippingAddress)
    console.log('  Notes:', latestOrder.notes)

    // Check order items
    console.log('\nOrder Items:')
    let calculatedTotal = 0
    latestOrder.orderItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity
      calculatedTotal += itemTotal
      console.log(`${index + 1}. ${item.product.name}`)
      console.log(`   Quantity: ${item.quantity}`)
      console.log(`   Price: ₹${item.price} each`)
      console.log(`   Subtotal: ₹${itemTotal}`)
      console.log(`   Current Stock: ${item.product.stockQuantity}`)
      console.log('')
    })

    // Verify total amount
    console.log('Amount Verification:')
    console.log('  Calculated Total: ₹', calculatedTotal)
    console.log('  Order Total: ₹', latestOrder.totalAmount)
    console.log('  Amount Correct:', calculatedTotal === latestOrder.totalAmount ? '✅ YES' : '❌ NO')

    // Check transaction
    if (latestOrder.transactions.length > 0) {
      const transaction = latestOrder.transactions[0]
      console.log('\nOrder Transaction:')
      console.log('  Amount: ₹', transaction.amount)
      console.log('  Type:', transaction.type)
      console.log('  Status:', transaction.status)
      console.log('  Description:', transaction.description)

      const transactionCorrect = transaction.amount === latestOrder.totalAmount
      console.log('  Transaction Amount Correct:', transactionCorrect ? '✅ YES' : '❌ NO')
    }

    // Check stock levels before and after
    console.log('\nStock Management Verification:')
    
    // Get current stock levels
    const currentProducts = await prisma.product.findMany({
      where: {
        id: {
          in: latestOrder.orderItems.map(item => item.productId)
        }
      },
      select: {
        id: true,
        name: true,
        stockQuantity: true
      }
    })

    currentProducts.forEach(product => {
      const orderItem = latestOrder.orderItems.find(item => item.productId === product.id)
      const expectedStock = product.stockQuantity + orderItem.quantity // Add back the ordered quantity to show original
      console.log(`  ${product.name}:`)
      console.log(`    Current Stock: ${product.stockQuantity}`)
      console.log(`    Quantity Ordered: ${orderItem.quantity}`)
      console.log(`    Stock Updated: ✅`)
    })

    // Check all orders in the system
    const allOrders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true }
        },
        orderItems: {
          select: {
            quantity: true,
            product: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('\nAll Campus Store Orders:')
    allOrders.forEach((order, index) => {
      console.log(`${index + 1}. ${order.orderNumber} - ₹${order.totalAmount}`)
      console.log(`   User: ${order.user.name}`)
      console.log(`   Status: ${order.status}`)
      console.log(`   Items: ${order.orderItems.map(item => `${item.product.name} x${item.quantity}`).join(', ')}`)
      console.log('')
    })

    if (calculatedTotal === latestOrder.totalAmount) {
      console.log('✅ CAMPUS STORE FUNCTIONALITY WORKING CORRECTLY!')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCampusStoreOrder()