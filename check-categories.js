const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      take: 10,
      orderBy: { name: 'asc' }
    })

    console.log('Available Categories:')
    categories.forEach(cat => {
      console.log(`ID: ${cat.id}, Name: "${cat.name}"`)
    })

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()