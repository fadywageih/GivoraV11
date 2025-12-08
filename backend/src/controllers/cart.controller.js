import prisma from '../config/database.js';

export const getCart = async (req, res, next) => {
    try {
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: req.user.id },
            include: {
                product: {
                    include: {
                        variants: {
                            orderBy: { sortOrder: 'asc' }
                        }
                    }
                },
                variant: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // تصفية العناصر التي تحتوي على منتج غير موجود
        const validCartItems = cartItems.filter(item => {
            if (item.product === null) {
                console.warn(`⚠️ Found cart item with missing product: ${item.id}`);
                return false;
            }
            return true;
        });

        // إذا كان هناك عناصر غير صالحة، احذفها
        const invalidItems = cartItems.filter(item => item.product === null);
        if (invalidItems.length > 0) {
            console.log(`🗑️ Deleting ${invalidItems.length} invalid cart items`);
            await prisma.cartItem.deleteMany({
                where: {
                    id: { in: invalidItems.map(item => item.id) }
                }
            });
        }

        res.json({
            success: true,
            data: { cartItems: validCartItems }
        });
    } catch (error) {
        console.error('❌ Error in getCart:', error);
        next(error);
    }
};

export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, variantId } = req.body;
        
        console.log('🛒 Adding to cart:', { 
            productId, 
            quantity, 
            variantId,
            userId: req.user.id 
        });

        // التحقق من وجود المنتج أولاً
        const product = await prisma.product.findUnique({
            where: { id: String(productId) },
            include: {
                variants: true
            }
        });
        
        console.log('📦 Product found:', !!product);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // التحقق من أن المنتج فعال
        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Product is not available'
            });
        }

        let variantToUse = null;
        let stockToCheck = product.stockQuantity;
        const isWholesale = req.user.accountType === 'wholesale' && req.user.approved;
        let priceToUse = isWholesale ? product.wholesalePrice : product.retailPrice;

        if (product.productType === 'variable') {
            if (!variantId) {
                return res.status(400).json({
                    success: false,
                    message: 'Variant selection is required for variable products'
                });
            }

            variantToUse = await prisma.productVariant.findUnique({
                where: { 
                    id: String(variantId),
                    productId: String(productId) // تأكد أن الفاريانت يتبع المنتج الصحيح
                }
            });

            console.log('🎯 Variant found:', !!variantToUse);
            
            if (!variantToUse) {
                return res.status(404).json({
                    success: false,
                    message: 'Selected variant not found for this product'
                });
            }

            // التحقق من أن الفاريانت فعال
            if (!variantToUse.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Selected variant is not available'
                });
            }

            stockToCheck = variantToUse.stockQuantity;
            priceToUse = isWholesale ? variantToUse.wholesalePrice : variantToUse.retailPrice;
        }

        // التحقق من المخزون
        if (stockToCheck < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
        }

        // التحقق من MOQ للمستخدمين الجملة
        const minQty = isWholesale ? Math.max(3, product.moq) : product.moq;
        if (isWholesale && quantity < minQty) {
            return res.status(400).json({
                success: false,
                message: `Wholesale customers must order at least ${minQty} units`
            });
        }
        
        // البحث عن عنصر موجود في السلة
        let existingItem = await prisma.cartItem.findFirst({
            where: {
                userId: req.user.id,
                productId: String(productId),
                variantId: variantId ? String(variantId) : null
            }
        });

        console.log('🔍 Existing cart item:', existingItem);

        let cartItem;

        if (existingItem) {
            // إذا كان العنصر موجود بالفعل، قم بتحديث الكمية
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity
                },
                include: {
                    product: {
                        include: {
                            variants: {
                                orderBy: { sortOrder: 'asc' }
                            }
                        }
                    },
                    variant: true
                }
            });
        } else {
            // إنشاء عنصر جديد في السلة
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: req.user.id,
                    productId: String(productId),
                    variantId: variantId ? String(variantId) : null,
                    quantity: quantity
                },
                include: {
                    product: {
                        include: {
                            variants: {
                                orderBy: { sortOrder: 'asc' }
                            }
                        }
                    },
                    variant: true
                }
            });
        }

        console.log('✅ Cart item created/updated:', cartItem.id);

        res.status(201).json({
            success: true,
            message: 'Item added to cart',
            data: { cartItem }
        });
    } catch (error) {
        console.error('❌ Error in addToCart:', error);
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;

        console.log('✏️ Updating cart item:', { itemId, quantity });

        // الحصول على عنصر السلة مع الفاريانت
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId },
            include: {
                product: true,
                variant: true
            }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // التحقق من الملكية
        if (cartItem.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // التحقق من الحد الأدنى للكمية لمستخدمي الجملة
        const isWholesale = req.user.accountType === 'wholesale' && req.user.approved;
        if (isWholesale && quantity < 3) {
            return res.status(400).json({
                success: false,
                message: 'Wholesale customers must have at least 3 units per item'
            });
        }

        // التحقق من المخزون
        const availableStock = cartItem.variant 
            ? cartItem.variant.stockQuantity 
            : cartItem.product.stockQuantity;

        if (availableStock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
        }

        // تحديث الكمية
        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: {
                product: {
                    include: {
                        variants: {
                            orderBy: { sortOrder: 'asc' }
                        }
                    }
                },
                variant: true
            }
        });

        res.json({
            success: true,
            message: 'Cart updated',
            data: { cartItem: updatedItem }
        });
    } catch (error) {
        console.error('❌ Error in updateCartItem:', error);
        next(error);
    }
};

export const removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        // الحصول على عنصر السلة
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // التحقق من الملكية
        if (cartItem.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // حذف العنصر
        await prisma.cartItem.delete({
            where: { id: itemId }
        });

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        console.error('❌ Error in removeFromCart:', error);
        next(error);
    }
};

export const clearCart = async (req, res, next) => {
    try {
        await prisma.cartItem.deleteMany({
            where: { userId: req.user.id }
        });

        res.json({
            success: true,
            message: 'Cart cleared'
        });
    } catch (error) {
        console.error('❌ Error in clearCart:', error);
        next(error);
    }
};