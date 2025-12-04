import express from 'express';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
} from '../controllers/products.controller.js';
import { authenticate, authenticateAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validateProduct, validateVariableProduct, validateId } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', validateId, getProductById);

// Admin routes
// Dynamic validation based on product type
const validateProductType = (req, res, next) => {
    const productType = req.body.productType;
    if (productType === 'variable') {
        return validateVariableProduct(req, res, next);
    }
    return validateProduct(req, res, next);
};

router.post('/', authenticateAdmin, validateProductType, createProduct);
router.put('/:id', authenticateAdmin, validateId, updateProduct);
router.delete('/:id', authenticateAdmin, validateId, deleteProduct);
router.post('/upload-image', authenticateAdmin, upload.single('image'), uploadProductImage);

export default router;