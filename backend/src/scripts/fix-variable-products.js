import prisma from '../config/database.js';

/**
 * Fix existing products that were created as simple but should be variable
 * These products have the wrong productType because the bug wasn't fixed earlier
 */

async function fixVariableProducts() {
  try {
    console.log('🔧 Fixing variable products...\n');

    // The products with these IDs should be variable (they had variants submitted)
    // Based on the user's data: 6931d6690407158118b9d211 and 6931d9b40407158118b9d213
    
    const productsToFix = [
      '6931d6690407158118b9d211', // "variable product"
      '6931d9b40407158118b9d213'  // "variable product1"
    ];

    let fixedCount = 0;

    for (const productId of productsToFix) {
      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (product) {
        // Check if this product actually has variants in the database
        const variants = await prisma.productVariant.findMany({
          where: { productId }
        });

        if (variants.length > 0) {
          // This is actually a variable product - fix it
          await prisma.product.update({
            where: { id: productId },
            data: { productType: 'variable' }
          });
          console.log(`✅ Fixed "${product.name}" (ID: ${productId})`);
          console.log(`   Found ${variants.length} variant(s)\n`);
          fixedCount++;
        } else {
          console.log(`⚠️  "${product.name}" has no variants in database - keeping as simple`);
          console.log(`   ID: ${productId}\n`);
        }
      }
    }

    console.log(`📊 Fixed ${fixedCount} product(s)`);

    // Show final state
    console.log('\n📊 Updated product list:');
    const allProducts = await prisma.product.findMany({
      select: { id: true, name: true, productType: true }
    });
    
    allProducts.forEach(p => {
      console.log(`- ${p.name}: ${p.productType}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVariableProducts();
