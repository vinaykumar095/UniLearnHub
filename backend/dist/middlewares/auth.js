"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const decoded = (0, jwt_1.verifyToken)(token);
    if (!decoded) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    console.log(`[Protect] Token Decoded:`, { id: decoded.id, role: decoded.role, collegeId: decoded.collegeId || 'N/A (Global)' });
    req.user = decoded;
    next();
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            console.log(`[Authorize] Blocked request for roles: ${roles.join(', ')}. Current user role: ${req.user?.role}`);
            return res.status(403).json({
                message: `User role ${req.user?.role} is not authorized to access this route`,
            });
        }
        next();
    };
};
exports.authorize = authorize;
