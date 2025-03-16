import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config/env.js";
import User from '../models/User.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided. Unauthorized' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);

        if (!user || !user.active) {
            return res.status(403).json({ success: false, message: 'Account inactive or not found. Access denied.' });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error('Authorization error:', error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
        }

        return res.status(401).json({ success: false, message: 'Invalid token. Please sign in again.' });
    }
};

export default authorize;