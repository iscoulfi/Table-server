import { Router } from 'express';
import {
  register,
  login,
  getMe,
  getAll,
  removeUser,
} from '../controlers/auth.js';
import { checkAuth } from '../utils/checkAuth.js';
const router = new Router();

// Register
// http://localhost:5000/api/auth/register
router.post('/register', register);

// Login
// http://localhost:5000/api/auth/login
router.post('/login', login);

// Get Profile
// http://localhost:5000/api/auth/me
router.get('/me', checkAuth, getMe);

// Get Profile
// http://localhost:5000/api/auth/all
router.get('/all', getAll);

// Remove User
// http://localhost:5000/api/auth/:id
router.delete('/:id', removeUser);

export default router;
