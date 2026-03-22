import { Router } from 'express';
import { createJob, getJobs, applyForJob, getRecruiterJobs, getJobApplicants, updateApplicationStatus, getStudentApplications, getStudentDashboard, getCollegeApplications } from '../controllers/jobController';
import { protect, authorize } from '../middlewares/auth';
import { Role } from '../models/User';

const router = Router();

router.post('/', protect, authorize(Role.RECRUITER), createJob);
router.get('/', protect, getJobs);
router.get('/recruiter', protect, authorize(Role.RECRUITER), getRecruiterJobs);
router.get('/college/applications', protect, authorize(Role.COLLEGE_ADMIN), getCollegeApplications);
router.get('/:jobId/applicants', protect, authorize(Role.RECRUITER), getJobApplicants);
router.post('/apply', protect, authorize(Role.STUDENT), applyForJob);
router.get('/student/applications', protect, authorize(Role.STUDENT), getStudentApplications);
router.get('/student/dashboard', protect, authorize(Role.STUDENT), getStudentDashboard);
router.patch('/applications/:id/status', protect, authorize(Role.RECRUITER), updateApplicationStatus);

export default router;
