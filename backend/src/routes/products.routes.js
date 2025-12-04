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
// Dynamic validation based on product type - applies correct validator
const applyProductValidation = (req, res, next) => {
    const productType = req.body?.productType;
    const validators = productType === 'variable' ? validateVariableProduct : validateProduct;
    
    // Apply each validator in the chain
    let index = 0;
    const executeValidators = () => {
        if (index >= validators.length) {
            return next();
        }
        const validator = validators[index++];
        validator(req, res, executeValidators);
    };
    executeValidators();
};

router.post('/', authenticateAdmin, applyProductValidation, createProduct);
router.put('/:id', authenticateAdmin, validateId, updateProduct);
router.delete('/:id', authenticateAdmin, validateId, deleteProduct);
router.post('/upload-image', authenticateAdmin, upload.single('image'), uploadProductImage);

export default router;