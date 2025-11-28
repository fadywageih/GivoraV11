import express from 'express';
import { adminLogin } from '../controllers/auth.controller.js';
import {
    getDashboardStats,
    getAdminProducts,
    getWholesaleApplications,
    approveWholesaleApplication,
    rejectWholesaleApplication,
    getContactMessages,
    markMessageAsRead,
    deleteContactMessage,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    sendWholesaleWelcomeEmailController // ✅ استخدم الاسم الصحيح
} from '../controllers/admin.controller.js';
import { authenticateAdmin } from '../middleware/auth.js';
import { validateLogin } from '../utils/validators.js';

const router = express.Router();

// Admin login (public)
router.post('/login', validateLogin, adminLogin);

// All other admin routes require authentication
router.use(authenticateAdmin);

router.get('/me', (req, res) => {
    res.json({
        success: true,
        data: {
            admin: {
                email: req.admin.email,
                role: 'admin'
            }
        }
    });
});

// Dashboard
router.get('/stats', getDashboardStats);

// Products
router.get('/products', getAdminProducts);

// Wholesale management
router.get('/wholesale/applications', getWholesaleApplications);
router.put('/wholesale/:id/approve', approveWholesaleApplication);
router.put('/wholesale/:id/reject', rejectWholesaleApplication);
router.post('/wholesale/:id/welcome-email', sendWholesaleWelcomeEmailController); // ✅ استخدم الاسم الصحيح

// Contact messages
router.get('/messages', getContactMessages);
router.put('/messages/:id/read', markMessageAsRead);
router.delete('/messages/:id', deleteContactMessage);

// Orders management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Users management
router.get('/users', getAllUsers);

export default router;