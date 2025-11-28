import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (user, verificationCode) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: 'fadywageih14@gmail.com',
            to: user.email,
            subject: 'Verify Your Email Address',
            html: `
                <h1>Verify Your Email Address</h1>
                <p>Hi ${user.firstName + ' ' + user.lastName},</p>
                
                <p>Thank you for signing up for GIVORA! Please verify your email address by clicking the link below:</p>
                <p>use the following code to verify your email address: <strong>${verificationCode}</strong></p>
                
                <p>If you did not sign up for this account, please ignore this email.</p>
                <p>Thank you,<br/>GIVORA Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', user.email);
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};

export const sendPasswordResetEmail = async (user, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: 'fadywageih14@gmail.com',
            to: user.email,
            subject: 'Reset Your Password',
            html: `
                <h1>Reset Your Password</h1>
                <p>Hi ${user.firstName + ' ' + user.lastName},</p>
                
                <p>You have requested to reset your password. Please click the link below to reset your password:</p>
                <p>use the following token to reset your password: <strong>${resetToken}</strong></p>
                
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you,<br/>GIVORA Team</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', user.email);
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
};
export const sendWholesaleWelcomeEmail = async (user, businessName) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: 'fadywageih14@gmail.com',
            to: user.email,
            subject: 'Welcome to GIVORA Wholesale Program!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #0A1F44; text-align: center;">Welcome to GIVORA Wholesale!</h1>
                    
                    <p>Hi ${user.firstName} ${user.lastName},</p>
                    
                    <p>Congratulations! Your business <strong>${businessName}</strong> has been approved for our wholesale program.</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #0A1F44; margin-top: 0;">What's Next?</h3>
                        <ul>
                            <li>You now have access to wholesale pricing</li>
                            <li>Browse our exclusive wholesale products</li>
                            <li>Place bulk orders with special discounts</li>
                            <li>Dedicated account manager support</li>
                        </ul>
                    </div>
                    
                    <p>You can now login to your account and start exploring our wholesale catalog.</p>
                    
                    <p>Best regards,<br/>
                    <strong>GIVORA Wholesale Team</strong></p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Wholesale welcome email sent to:', user.email);
        
    } catch (error) {
        console.error('Error sending wholesale welcome email:', error);
        throw error;
    }
};