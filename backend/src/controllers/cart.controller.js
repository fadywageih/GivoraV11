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

        res.json({
            success: true,
            data: { cartItems }
        });
    } catch (error) {
        next(error);
    }
};
export const addToCart = async (req, res, next) => {
    try {
        const { productId, quantity, variantId } = req.body;
        const product = await prisma.product.findUnique({
            where: { id: String(productId) },
            include: {
                variants: true
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        let variantToUse = null;
        let stockToCheck = product.stockQuantity;

        if (product.productType === 'variable') {
            if (!variantId) {
                return res.status(400).json({
                    success: false,
                    message: 'Variant selection is required for variable products'
                });
            }

            variantToUse = await prisma.productVariant.findUnique({
                where: { id: String(variantId) }
            });

            if (!variantToUse || variantToUse.productId !== product.id) {
                return res.status(404).json({
                    success: false,
                    message: 'Selected variant not found'
                });
            }

            stockToCheck = variantToUse.stockQuantity;
        }

        if (stockToCheck < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock available'
            });
        }
        
        // For simple products (no variantId), search by userId and productId
        // For variable products, ALWAYS require variantId to keep them separate
        let existingItem;
        
        if (product.productType === 'simple') {
            // Simple product: find by userId and productId, with variantId null
            existingItem = await prisma.cartItem.findFirst({
                where: {
                    userId: req.user.id,
                    productId: String(productId),
                    variantId: null
                }
            });
        } else {
            // Variable product: ALWAYS use variantId (already validated above)
            // This ensures each variant combination is stored separately
            existingItem = await prisma.cartItem.findFirst({
                where: {
                    userId: req.user.id,
                    productId: String(productId),
                    variantId: String(variantId)
                }
            });
        }

        let cartItem;

        if (existingItem) {
            // If same variant already exists, increase quantity
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
            // Create new cart item with separate variant
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: req.user.id,
                    productId: String(productId),
                    variantId: variantId ? String(variantId) : null,
                    quantity
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

        res.status(201).json({
            success: true,
            message: 'Item added to cart',
            data: { cartItem }
        });
    } catch (error) {
        next(error);
    }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Get cart item with variant
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

    // Verify ownership
    if (cartItem.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Check minimum quantity for wholesale users
    const isWholesale = req.user.account_type === 'wholesale' && req.user.approved;
    if (isWholesale && quantity < 3) {
      return res.status(400).json({
        success: false,
        message: 'Wholesale customers must have at least 3 units per item'
      });
    }

    // Check stock - use variant stock if variant is selected, otherwise product stock
    const availableStock = cartItem.variant 
      ? cartItem.variant.stockQuantity 
      : cartItem.product.stockQuantity;

    if (availableStock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    // Update quantity
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
    next(error);
  }
};
export const removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        // Get cart item
        const cartItem = await prisma.cartItem.findUnique({
            where: { id: itemId }
        });

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // Verify ownership
        if (cartItem.userId !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        // Delete item
        await prisma.cartItem.delete({
            where: { id: itemId }
        });

        res.json({
            success: true,
            message: 'Item removed from cart'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Clear entire cart
 * DELETE /api/cart
 */
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
        next(error);
    }
};