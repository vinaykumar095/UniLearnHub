import { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Role } from '../models/User';

export interface AuthRequest extends ExpressRequest {
    user?: {
        id: string;
        role: Role;
        collegeId?: string | null;
    };
}

export const protect = (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }

    console.log(`[Protect] Token Decoded:`, { id: decoded.id, role: decoded.role, collegeId: decoded.collegeId || 'N/A (Global)' });
    req.user = decoded;
    next();
};

export const authorize = (...roles: Role[]) => {
    return (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.log(`[Authorize] Blocked request for roles: ${roles.join(', ')}. Current user role: ${req.user?.role}`);
            return res.status(403).json({
                message: `User role ${req.user?.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
