import { Router } from 'express';
import { register, login, getCurrentUser, updateProfile, deleteProfile, getUserBySlug, adminListUsers, adminUpdateUser, adminDeleteUser } from '../controllers/authController';
import { auth, adminAuth } from '../middleware/auth';
import { validateUserRegistration } from '../middleware/validation';

const router = Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', login);
router.get('/user/:slug', getUserBySlug);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, updateProfile);
router.delete('/profile', auth, deleteProfile);

// Admin routes
router.get('/admin/users', adminAuth, adminListUsers);
router.put('/admin/users/:id', adminAuth, adminUpdateUser);
router.delete('/admin/users/:id', adminAuth, adminDeleteUser);

export default router; 