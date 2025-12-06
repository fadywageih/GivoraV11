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
import { validationResult } from 'express-validator'; // أضف هذا الاستيراد

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', validateId, getProductById);

// Admin routes - الحل الصحيح
const validateProductType = (req, res, next) => {
    const productType = req.body?.productType || 'simple';
    const validators = productType === 'variable' ? validateVariableProduct : validateProduct;
    
    // تأكد أن validators مصفوفة
    if (!Array.isArray(validators)) {
        return res.status(500).json({
            success: false,
            message: 'Validators configuration error'
        });
    }
    
    // تطبيق جميع validators بالتسلسل
    let index = 0;
    const runValidators = () => {
        if (index >= validators.length) {
            // بعد تطبيق جميع validators، تحقق من الأخطاء
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array().map(err => ({
                        field: err.path,
                        message: err.msg
                    }))
                });
            }
            return next();
        }
        
        const validator = validators[index++];
        validator(req, res, (err) => {
            if (err) return next(err);
            runValidators();
        });
    };
    
    runValidators();
};

router.post('/', authenticateAdmin, validateProductType, createProduct);
router.put('/:id', authenticateAdmin, validateId, updateProduct);
router.delete('/:id', authenticateAdmin, validateId, deleteProduct);
router.post('/upload-image', authenticateAdmin, upload.single('image'), uploadProductImage);

export default router;
