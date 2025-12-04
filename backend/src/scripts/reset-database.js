import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDatabase() {
    console.log('🔄 Starting database reset...\n');
    
    try {
        // Delete all data from collections in reverse dependency order
        console.log('🗑️  Deleting product variants...');
        await prisma.productVariant.deleteMany({});
        
        console.log('🗑️  Deleting product images...');
        await prisma.productImage.deleteMany({});
        
        console.log('🗑️  Deleting products...');
        await prisma.product.deleteMany({});
        
        console.log('🗑️  Deleting cart items...');
        await prisma.cartItem.deleteMany({});
        
        console.log('🗑️  Deleting order items...');
        await prisma.orderItem.deleteMany({});
        
        console.log('🗑️  Deleting orders...');
        await prisma.order.deleteMany({});
        
        console.log('🗑️  Deleting wholesale applications...');
        await prisma.wholesaleApplication.deleteMany({});
        
        console.log('🗑️  Deleting password reset tokens...');
        await prisma.passwordResetToken.deleteMany({});
        
        console.log('🗑️  Deleting tokens...');
        await prisma.token.deleteMany({});
        
        console.log('🗑️  Deleting users...');
        await prisma.user.deleteMany({});
        
        console.log('\n✅ Database reset completed successfully!');
        console.log('✅ All collections cleared and ready for fresh data.');
        
    } catch (error) {
        console.error('❌ Error during reset:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

resetDatabase();
