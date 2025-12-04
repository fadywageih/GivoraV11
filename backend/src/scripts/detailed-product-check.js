import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectProducts() {
    console.log('🔍 Detailed Product Inspection\n');
    
    try {
        const products = await prisma.product.findMany({
            include: {
                variants: true,
                productImages: true
            }
        });

        console.log(`📊 Total Products: ${products.length}\n`);

        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name}`);
            console.log(`   ID: ${product.id}`);
            console.log(`   SKU: ${product.sku}`);
            console.log(`   Type: ${product.productType}`);
            console.log(`   Active: ${product.isActive}`);
            console.log(`   Variants: ${product.variants.length}`);
            console.log(`   Images: ${product.productImages.length}`);
            console.log(`   Created: ${product.createdAt.toLocaleDateString()}`);
            console.log(`   Updated: ${product.updatedAt.toLocaleDateString()}`);
            
            if (product.variants.length > 0) {
                console.log(`   \n   Variants:`);
                product.variants.forEach((v, i) => {
                    console.log(`     ${i + 1}. SKU: ${v.variantSku} | Size: ${v.dimensions} | Stock: ${v.stockQuantity}`);
                });
            }
            
            console.log('');
        });

        // Count by type
        const simpleCount = products.filter(p => p.productType === 'simple').length;
        const variableCount = products.filter(p => p.productType === 'variable').length;
        const withVariants = products.filter(p => p.variants.length > 0).length;

        console.log(`\n📈 Summary:`);
        console.log(`   Simple Products: ${simpleCount}`);
        console.log(`   Variable Products: ${variableCount}`);
        console.log(`   Products with Variants: ${withVariants}`);
        
        if (variableCount > 0 && withVariants < variableCount) {
            console.log(`   ⚠️  ${variableCount - withVariants} variable product(s) have NO variants!`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

inspectProducts();
