import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
    console.log('🔐 Generating token with expiry:', config.jwtExpiresIn);
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
    });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        console.log('🔐 Verifying token...');
        const decoded = jwt.verify(token, config.jwtSecret);
        console.log('✅ Token verified successfully');
        console.log('🔐 Token expires at:', new Date(decoded.exp * 1000));
        console.log('🔐 Current time:', new Date());
        return decoded;
    } catch (error) {
        console.error('❌ JWT Verification Error:', error.message);
        console.error('❌ Token that failed:', token);
        return null;
    }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token) => {
    try {
        return jwt.decode(token);
    } catch (error) {
        console.error('❌ JWT Decode Error:', error.message);
        return null;
    }
};