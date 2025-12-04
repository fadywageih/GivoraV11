import prisma from '../config/database.js';
import { deleteCloudinaryImage, deleteLocalImage, getCloudinaryPublicId, getLocalFilename, isUsingCloudinary, uploadToCloudinary } from '../middleware/upload.js';
import {
    createSimpleProduct,
    createVariableProduct,
    updateProductData,
    getProductWithDetails,
    getAllProductsWithFilters,
    deleteProductData
} from '../services/product.service.js';

export const getAllProducts = async (req, res, next) => {
    try {
        const { category, search, isActive } = req.query;

        const filters = {
            category: category || undefined,
            search: search || undefined,
            isActive: isActive !== undefined ? isActive === 'true' : undefined
        };

        const products = await getAllProductsWithFilters(filters);

        res.json({
            success: true,
            data: { products }
        });
    } catch (error) {
        next(error);
    }
};
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await getProductWithDetails(String(id));

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};
export const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            category,
            description,
            sku,
            productType = 'simple',
            moq,
            retailPrice,
            wholesalePrice,
            stockQuantity,
            imageUrl,
            cloudinaryId,
            isActive,
            productImages,
            variants
        } = req.body;

        const productData = {
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
        };

        let product;

        if (productType === 'variable') {
            // Create variable product with variants
            product = await createVariableProduct(
                productData,
                variants || [],
                productImages
            );
        } else {
            // Create simple product
            product = await createSimpleProduct(
                productData,
                productImages
            );
        }

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update product (Admin only)
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
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
            isActive,
            productImages,
            variants
        } = req.body;

        // Get existing product to check for old image
        const existingProduct = await getProductWithDetails(String(id));

        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // If image is being updated, delete old image
        if (imageUrl && imageUrl !== existingProduct.imageUrl) {
            if (isUsingCloudinary() && existingProduct.cloudinaryId) {
                await deleteCloudinaryImage(existingProduct.cloudinaryId);
            } else if (existingProduct.imageUrl) {
                const filename = getLocalFilename(existingProduct.imageUrl);
                if (filename) {
                    deleteLocalImage(filename);
                }
            }
        }

        const productData = {
            name,
            category,
            description,
            sku,
            productType: productType || existingProduct.productType,
            moq,
            retailPrice,
            wholesalePrice,
            stockQuantity,
            imageUrl,
            cloudinaryId,
            isActive
        };

        // Update product
        const product = await updateProductData(
            String(id),
            productData,
            productType === 'variable' ? variants : null,
            productImages
        );

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: { product }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product (Admin only)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Get product to delete associated image
        const product = await getProductWithDetails(String(id));

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Delete image
        if (isUsingCloudinary() && product.cloudinaryId) {
            await deleteCloudinaryImage(product.cloudinaryId);
        } else if (product.imageUrl) {
            const filename = getLocalFilename(product.imageUrl);
            if (filename) {
                deleteLocalImage(filename);
            }
        }

        // Delete product and related data
        await deleteProductData(String(id));

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Upload product image
 * POST /api/products/upload-image
 */
export const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image file provided'
            });
        }

        let imageData = {};

        if (isUsingCloudinary()) {
            // Upload to Cloudinary from buffer
            const result = await uploadToCloudinary(req.file.buffer);

            imageData = {
                imageUrl: result.secure_url,
                cloudinaryId: result.public_id
            };
        } else {
            // Local file upload
            const protocol = req.protocol;
            const host = req.get('host');
            imageData = {
                imageUrl: `${protocol}://${host}/uploads/products/${req.file.filename}`,
                cloudinaryId: null
            };
        }

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: imageData
        });
    } catch (error) {
        next(error);
    }
};