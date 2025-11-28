import prisma from '../config/database.js';
export const applyForWholesale = async (req, res, next) => {
    try {
        const {
            businessName,
            einNumber,
            businessType,
            address,
            city,
            state,
            zip,
            phone
        } = req.body;
        const existingApp = await prisma.wholesaleApplication.findUnique({
            where: { userId: req.user.id }
        });
        if (existingApp) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted a wholesale application',
                data: { application: existingApp }
            });
        }
        const application = await prisma.wholesaleApplication.create({
            data: {
                userId: req.user.id,
                businessName,
                einNumber,
                businessType,
                address,
                city,
                state,
                zip,
                phone,
                approvalStatus: 'pending'
            }
        });
        res.status(201).json({
            success: true,
            message: 'Wholesale application submitted successfully',
            data: { application }
        });
    } catch (error) {
        next(error);
    }
};
export const getWholesaleStatus = async (req, res, next) => {
    try {
        const application = await prisma.wholesaleApplication.findUnique({
            where: { userId: req.user.id }
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'No wholesale application found'
            });
        }
        res.json({
            success: true,
            data: { application }
        });
    } catch (error) {
        next(error);
    }
};