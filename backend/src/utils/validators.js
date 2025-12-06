import { body, param, query, validationResult } from 'express-validator';

export const validate = (req, res, next) => {   
    const errors = validationResult(req);       
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

export const validateRegister = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('accountType').isIn(['retail', 'wholesale']).withMessage('Account type must be either retail or wholesale'),
    body('firstName').optional().trim().isLength({ min: 1 }).withMessage('First name cannot be empty'),
    body('lastName').optional().trim().isLength({ min: 1 }).withMessage('Last name cannot be empty'),
    validate
];

export const validateLogin = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

export const validateProduct = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('moq').isInt({ min: 1 }).withMessage('MOQ must be a positive integer'),
    body('retailPrice').isFloat({ min: 0 }).withMessage('Retail price must be a positive number'),
    body('wholesalePrice').isFloat({ min: 0 }).withMessage('Wholesale price must be a positive number'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
    validate
];

export const validateVariableProduct = [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('sku').trim().notEmpty().withMessage('SKU is required'),
    body('productType').equals('variable').withMessage('Product type must be variable'),
    body('moq').isInt({ min: 1 }).withMessage('MOQ must be a positive integer'),
    body('retailPrice').isFloat({ min: 0 }).withMessage('Retail price must be a positive number'),
    body('wholesalePrice').isFloat({ min: 0 }).withMessage('Wholesale price must be a positive number'),
    body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
    body('variants').isArray({ min: 1 }).withMessage('Variable product must have at least one variant'),
    body('variants.*.variantSku').trim().notEmpty().withMessage('Variant SKU is required'),
    body('variants.*.retailPrice').isFloat({ min: 0 }).withMessage('Variant retail price must be a positive number'),
    body('variants.*.wholesalePrice').isFloat({ min: 0 }).withMessage('Variant wholesale price must be a positive number'),
    body('variants.*.stockQuantity').isInt({ min: 0 }).withMessage('Variant stock quantity must be a non-negative integer'),
    validate
];

// ✅ هذا هو الإصلاح - Cart Item Validation المثبت
export const validateCartItem = [
    body('productId')
        .notEmpty().withMessage('Product ID is required')
        .isString().withMessage('Product ID must be a string')
        .custom((value) => {
            if (!value || typeof value !== 'string') {
                throw new Error('Product ID must be a string');
            }
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(value);
            if (!isValidObjectId) {
                throw new Error('Invalid Product ID format');
            }
            return true;
        }),
    
    body('quantity')
        .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    
    body('variantId')
        .optional()
        .isString().withMessage('Variant ID must be a string')
        .custom((value) => {
            if (value && typeof value === 'string') {
                const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(value);
                if (!isValidObjectId) {
                    throw new Error('Invalid Variant ID format');
                }
            }
            return true;
        }),
    
    validate
];

export const validateOrder = [
    body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingMethod').optional().trim().notEmpty().withMessage('Shipping method cannot be empty'),
    body('paymentMethod').optional().trim().notEmpty().withMessage('Payment method cannot be empty'),
    validate
];

export const validateWholesaleApplication = [
    body('businessName').trim().notEmpty().withMessage('Business name is required'),
    body('einNumber').trim().notEmpty().withMessage('EIN number is required'),
    body('businessType').trim().notEmpty().withMessage('Business type is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('zip').trim().notEmpty().withMessage('ZIP code is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    validate
];

export const validateContactMessage = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    validate
];

export const validatePasswordReset = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    validate
];

export const validateNewPassword = [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    validate
];

export const validateId = [
    param('id').notEmpty().withMessage('ID is required'),
    validate
];
