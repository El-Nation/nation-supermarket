import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/User';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'Not authorized, user not found' });
            return;
        }

        // Attach user to request without sending back passwords in next handlers
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const admin = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};
