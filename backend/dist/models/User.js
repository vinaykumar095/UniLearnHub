"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var Role;
(function (Role) {
    Role["CENTRAL_ADMIN"] = "CENTRAL_ADMIN";
    Role["COLLEGE_ADMIN"] = "COLLEGE_ADMIN";
    Role["FACULTY"] = "FACULTY";
    Role["STUDENT"] = "STUDENT";
    Role["RECRUITER"] = "RECRUITER";
})(Role || (exports.Role = Role = {}));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true },
    collegeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'College' },
    company: { type: String },
    skills: [{ type: String }],
    phone: { type: String },
    isPhoneVerified: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    notificationPreferences: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true }
    },
    privacySettings: {
        recruiterVisible: { type: Boolean, default: true },
        facultyVisible: { type: Boolean, default: true },
        publicVisible: { type: Boolean, default: false }
    },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    bio: { type: String },
    github: { type: String },
    linkedin: { type: String },
    leetcode: { type: String },
    codechef: { type: String },
    hackerrank: { type: String },
    website: { type: String },
    branch: { type: String },
    year: { type: String },
    cgpa: { type: Number },
    department: { type: String },
    designation: { type: String },
    qualification: { type: String },
    experience: { type: String },
    specialization: { type: String },
    researchInterests: { type: String },
    projects: [{
            title: { type: String, required: true },
            description: { type: String, required: true },
            techStack: [{ type: String }],
            link: { type: String },
            github: { type: String }
        }],
    avatar: { type: String },
    status: { type: String, enum: ['active', 'suspended', 'pending', 'deleted'], default: 'active' },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });
exports.default = mongoose_1.default.model('User', UserSchema);
