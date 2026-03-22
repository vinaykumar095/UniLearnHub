import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from '../models/User';
import College from '../models/College';
import Activity from '../models/Activity';
import { signToken } from '../utils/jwt';

export const register = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { name, email, password, role, collegeId, company } = req.body;

        // Role-based access control for registration
        const allowedRoles = ['STUDENT', 'FACULTY', 'RECRUITER'];
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: 'Unauthorized role registration. Please contact Central Admin.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Recruiters are global entities; Students and Faculty are college-specific
        const finalCollegeId = role === 'RECRUITER' ? undefined : collegeId;
        const userStatus = 'pending';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            collegeId: finalCollegeId,
            company: role === 'RECRUITER' ? company : undefined,
            status: userStatus
        });

        console.log(`[Register] User created:`, user.email, `Role:`, user.role, `CollegeId:`, user.collegeId, `Status:`, user.status);

        const successMessage = role === 'RECRUITER' 
            ? 'Registration successful! Your recruiter account is pending verification by the Platform Administrator.'
            : 'Registration successful! Your account is pending approval by your College/University admin.';

        const populatedUser = await User.findById(user._id).populate('collegeId', 'name');
        res.status(201).json({
            message: successMessage,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                collegeId: populatedUser?.collegeId 
            },
        });

        // Async notifications
        (async () => {
            try {
                const { createNotification } = require('./notificationController');
                if (role === 'STUDENT' || role === 'FACULTY') {
                    // Notify College Admin
                    const collegeAdmins = await User.find({ collegeId, role: 'COLLEGE_ADMIN' }).select('_id');
                    for (const admin of collegeAdmins) {
                        await createNotification(admin._id, `New ${role.toLowerCase()} registration: ${name} (${email}) pending approval.`);
                    }
                } else if (role === 'RECRUITER') {
                    // Notify Central Admin
                    const centralAdmins = await User.find({ role: 'CENTRAL_ADMIN' }).select('_id');
                    for (const admin of centralAdmins) {
                        await createNotification(admin._id, `New recruiter registration: ${name} (${email}) pending approval.`);
                    }
                }
            } catch (notifyError) {
                console.error('[Register] Notification Error:', notifyError);
            }
        })();
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

export const login = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).populate('collegeId', 'name');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.status === 'suspended') {
            return res.status(403).json({ message: 'Your account has been suspended. Please contact support.' });
        }

        if (user.status === 'deleted') {
            return res.status(403).json({ message: 'This account has been deactivated.' });
        }

        if (user.status === 'pending') {
            let message = 'Your account is pending approval.';
            if (user.role === 'RECRUITER') {
                message = 'Your recruiter account is pending verification by the platform administrator.';
            } else if (user.role === 'STUDENT' || user.role === 'FACULTY') {
                message = 'Your account is pending approval by your College/University admin. Please wait for access.';
            }
            return res.status(403).json({ message });
        }

        // Block College Admin login if their college is not approved yet
        if (user.role === 'COLLEGE_ADMIN' && user.collegeId) {
            const college = await College.findById(user.collegeId);
            if (!college || college.status !== 'active') {
                return res.status(403).json({
                    message: 'Your institution is pending approval by the Central Administrator. You will be notified once access is granted.'
                });
            }
        }

        const collegeIdToSign = user.collegeId && typeof user.collegeId === 'object' && '_id' in user.collegeId 
            ? (user.collegeId as any)._id 
            : user.collegeId;

        const token = signToken({ id: user._id, role: user.role, collegeId: collegeIdToSign });

        // Log login activity
        const userAgent = req.headers['user-agent'] || '';
        const ip = req.ip || req.socket.remoteAddress || 'unknown';

        let browser = 'Unknown Browser';
        if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        let os = 'Unknown OS';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Macintosh')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iPhone')) os = 'iOS';

        await Activity.create({
            userId: user._id,
            type: 'LOGIN',
            browser,
            os,
            ip,
            status: 'SUCCESS'
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                collegeId: user.collegeId,
                twoFactorEnabled: user.twoFactorEnabled,
                notificationPreferences: user.notificationPreferences,
                privacySettings: user.privacySettings
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};

export const forgotPassword = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: 'If an account with that email exists, a reset code has been generated.' });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.resetPasswordToken = hashedOtp;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        console.log(`[Password Reset] OTP for ${email}: ${otp}`);

        res.json({
            message: 'If an account with that email exists, a reset code has been generated.',
            otp // DEV ONLY: remove in production
        });
    } catch (error) {
        res.status(500).json({ message: 'Error processing forgot password request', error });
    }
};

export const resetPassword = async (req: ExpressRequest, res: ExpressResponse) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const user = await User.findOne({
            email,
            resetPasswordExpires: { $gt: new Date() }
        });

        if (!user || !user.resetPasswordToken) {
            return res.status(400).json({ message: 'Invalid or expired reset code.' });
        }

        const isValid = await bcrypt.compare(otp, user.resetPasswordToken);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid reset code.' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password has been reset successfully. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error });
    }
};
