import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

/**
 * Generate JWT token
 */
export const generateToken = (payload) => {
    return jwt.sign(payload, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn
    });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
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