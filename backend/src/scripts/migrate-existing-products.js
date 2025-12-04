import prisma from '../config/database.js';

/**
 * Migration script to update existing products with productType and isActive fields
 * This script should be run once to backfill the database
 */

async function migrateProducts() {
  try {
    console.log('🔄 Starting product migration...');

    // Get all products
    const allProducts = await prisma.product.findMany();
    console.log(`📊 Total products found: ${allProducts.length}`);

    let updateCount = 0;

    // Update each product individually
    for (const product of allProducts) {
      const needsUpdate = !product.productType || product.isActive === null;
      
      if (needsUpdate) {
        await prisma.product.update({
          where: { id: product.id },
          data: {
            productType: product.productType || 'simple',
            isActive: product.isActive !== null ? product.isActive : true
          }
        });
        updateCount++;
      }
    }

    console.log(`✅ Updated ${updateCount} products with missing fields`);

    // Verify all products now have required fields
    const updatedProducts = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        productType: true,
        isActive: true
      }
    });

    console.log(`📊 Final check - Total products: ${updatedProducts.length}`);
    const allHaveProductType = updatedProducts.every(p => p.productType);
    const allHaveIsActive = updatedProducts.every(p => p.isActive !== null);
    
    if (allHaveProductType && allHaveIsActive) {
      console.log('✅ Migration completed successfully - all products have required fields');
    } else {
      console.log('⚠️ Some products still missing fields:');
      updatedProducts.forEach(p => {
        if (!p.productType || p.isActive === null) {
          console.log(`  - ${p.name}: productType=${p.productType}, isActive=${p.isActive}`);
        }
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateProducts();
