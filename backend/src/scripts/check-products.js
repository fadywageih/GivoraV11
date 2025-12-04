import prisma from '../config/database.js';

async function checkDatabase() {
  try {
    console.log('📊 Checking database...\n');

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        productType: true,
        isActive: true
      }
    });

    console.log(`Total products: ${products.length}\n`);
    products.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Type: ${p.productType}`);
      console.log(`   Active: ${p.isActive}\n`);
    });

    return products;
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
