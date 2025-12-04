const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCampusStoreProducts() {
  try {
    // Get all available products
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          gt: 0
        }
      },
      include: {
        campus: {
          select: { name: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    console.log('Available Campus Store Products:')
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`)
      console.log(`   Price: ₹${product.price}`)
      console.log(`   Stock: ${product.stockQuantity}`)
      console.log(`   Category: ${product.category}`)
      console.log(`   Campus: ${product.campus.name}`)
      console.log(`   Digital: ${product.isDigital}`)
      console.log(`   SKU: ${product.sku || 'N/A'}`)
      console.log('')
    })

    // Test creating an order with some products
    if (products.length >= 2) {
      console.log('--- Testing Order Creation ---')
      
      const orderItems = [
        { productId: products[0].id, quantity: 1 },
        { productId: products[1].id, quantity: 2 }
      ]

      const totalAmount = (products[0].price * 1) + (products[1].price * 2)
      
      console.log('Order Items:')
      orderItems.forEach((item, index) => {
        const product = products.find(p => p.id === item.productId)
        console.log(`${index + 1}. ${product.name} x${item.quantity} = ₹${product.price * item.quantity}`)
      })
      console.log(`Total Amount: ₹${totalAmount}`)
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCampusStoreProducts()