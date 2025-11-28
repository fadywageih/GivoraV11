import dotenv from 'dotenv';

dotenv.config();
export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  adminAccounts: [
    {
      email: process.env.ADMIN_EMAIL_1 || 'FADyAdmin@gmail.com',
      password: process.env.ADMIN_PASSWORD_1 || 'PaSS@7821'
    },
    {
      email: process.env.ADMIN_EMAIL_2 || 'FADyAdmin@gmail.givora.eg',
      password: process.env.ADMIN_PASSWORD_2 || 'Test@15'
    }
  ],
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    folder: process.env.CLOUDINARY_FOLDER || 'givora/products'
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    uploadDir: process.env.UPLOAD_DIR || './uploads/products'
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com', // إضافة قيمة افتراضية
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.EMAIL_USER || process.env.SMTP_USER, // استخدام EMAIL_USER من .env
    pass: process.env.EMAIL_PASS || process.env.SMTP_PASS, // استخدام EMAIL_PASS من .env
    from: process.env.EMAIL_FROM || 'noreply@givora.com'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
};