import express from 'express';
import { signup, confirmEmail, login, googleAuth, googleCallback } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/signup',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  signup
);

router.get('/confirm', confirmEmail);
router.post('/login', login);

router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);

export default router;
