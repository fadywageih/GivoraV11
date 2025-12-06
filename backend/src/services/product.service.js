import prisma from '../config/database.js';

/**
 * Create a simple product
 */
export const createSimpleProduct = async (productData, imagesData = null) => {
    const {
        name,
        category,
        description,
        sku,
        productType,
        moq,
        retailPrice,
        wholesalePrice,
        stockQuantity,
        imageUrl,
        cloudinaryId,
        isActive
    } = productData;

    const product = await prisma.product.create({
        data: {
            name,
            category,
            description,
            sku,
            productType: productType || 'simple', // ⚠️ عدل هنا
            moq: parseInt(moq),
            retailPrice: parseFloat(retailPrice),
            wholesalePrice: parseFloat(wholesalePrice),
            stockQuantity: parseInt(stockQuantity),
            imageUrl,
            cloudinaryId,
            isActive: isActive !== undefined ? isActive : true,
            productImages: imagesData
                ? {
                      create: imagesData.create || imagesData
                  }
                : undefined
        },
        include: {
            productImages: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    return product;
};

/**
 * Create a variable product with variants
 */
export const createVariableProduct = async (productData, variants = [], imagesData = null) => {
    const {
        name,
        category,
        description,
        sku,
        productType,
        moq,
        retailPrice,
        wholesalePrice,
        stockQuantity,
        imageUrl,
        cloudinaryId,
        isActive
    } = productData;

    // Validate that at least one variant is provided
    if (!variants || variants.length === 0) {
        throw new Error('Variable product must have at least one variant');
    }

    // Create product with variants in a transaction
    const product = await prisma.product.create({
        data: {
            name,
            category,
            description,
            sku,
            productType: productType || 'variable', // ⚠️ عدل هنا
            moq: parseInt(moq),
            retailPrice: parseFloat(retailPrice),
            wholesalePrice: parseFloat(wholesalePrice),
            stockQuantity: parseInt(stockQuantity),
            imageUrl,
            cloudinaryId,
            isActive: isActive !== undefined ? isActive : true,
            productImages: imagesData
                ? {
                      create: imagesData.create || imagesData
                  }
                : undefined,
            variants: {
                create: variants.map((variant) => ({
                    variantSku: variant.variantSku,
                    dimensions: variant.dimensions ? String(variant.dimensions) : null,
                    packetSize: variant.packetSize ? String(variant.packetSize) : null,
                    retailPrice: parseFloat(variant.retailPrice),
                    wholesalePrice: parseFloat(variant.wholesalePrice),
                    stockQuantity: parseInt(variant.stockQuantity),
                    sortOrder: variant.sortOrder || 0,
                    isDefault: variant.isDefault || false,
                    isActive: variant.isActive !== undefined ? variant.isActive : true
                }))
            }
        },
        include: {
            productImages: {
                orderBy: { sortOrder: 'asc' }
            },
            variants: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    return product;
};

/**
 * Update product (simple or variable)
 */
export const updateProductData = async (productId, productData, variants = null, imagesData = null) => {
    // Ensure productId is a string
    const id = String(productId);
    
    const {
        name,
        category,
        description,
        sku,
        moq,
        retailPrice,
        wholesalePrice,
        stockQuantity,
        imageUrl,
        cloudinaryId,
        isActive,
        productType
    } = productData;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (sku !== undefined) updateData.sku = sku;
    if (moq !== undefined) updateData.moq = parseInt(moq);
    if (retailPrice !== undefined) updateData.retailPrice = parseFloat(retailPrice);
    if (wholesalePrice !== undefined) updateData.wholesalePrice = parseFloat(wholesalePrice);
    if (stockQuantity !== undefined) updateData.stockQuantity = parseInt(stockQuantity);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (cloudinaryId !== undefined) updateData.cloudinaryId = cloudinaryId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (productType !== undefined) updateData.productType = productType; // ⚠️ عدل هنا

    // Handle product images
    if (imagesData !== null) {
        updateData.productImages = {
            deleteMany: {},
            create: imagesData.create || imagesData
        };
    }

    // Handle variants for variable products
    if (variants !== null && productType === 'variable') {
        updateData.variants = {
            deleteMany: {},
            create: variants.map((variant) => ({
                variantSku: variant.variantSku,
                dimensions: variant.dimensions ? String(variant.dimensions) : null,
                packetSize: variant.packetSize ? String(variant.packetSize) : null,
                retailPrice: parseFloat(variant.retailPrice),
                wholesalePrice: parseFloat(variant.wholesalePrice),
                stockQuantity: parseInt(variant.stockQuantity),
                sortOrder: variant.sortOrder || 0,
                isDefault: variant.isDefault || false,
                isActive: variant.isActive !== undefined ? variant.isActive : true
            }))
        };
    }

    const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
            productImages: {
                orderBy: { sortOrder: 'asc' }
            },
            variants: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    return product;
};

/**
 * Get product by ID with all related data
 */
export const getProductWithDetails = async (productId) => {
    // Ensure productId is a string
    const id = String(productId);
    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            productImages: {
                orderBy: { sortOrder: 'asc' }
            },
            variants: {
                orderBy: { sortOrder: 'asc' }
            }
        }
    });

    return product;
};

/**
 * Get all products with filters
 */
export const getAllProductsWithFilters = async (filters = {}) => {
    const { category, search, isActive } = filters;
    const where = {};

    if (category && category !== 'all') {
        where.category = category;
    }

    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } }
        ];
    }

    if (isActive !== undefined) {
        where.isActive = isActive;
    }

    const products = await prisma.product.findMany({
        where,
        include: {
            productImages: {
                orderBy: { sortOrder: 'asc' }
            },
            variants: {
                orderBy: { sortOrder: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return products;
};

/**
 * Delete product and all related data
 */
export const deleteProductData = async (productId) => {
    // Ensure productId is a string
    const id = String(productId);
    // Delete product (cascades will handle variants and images)
    const product = await prisma.product.delete({
        where: { id },
        include: {
            productImages: true,
            variants: true
        }
    });

    return product;
};
