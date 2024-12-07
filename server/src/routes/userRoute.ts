import { Router } from 'express';
import userController from '../controllers/userController';
import authenticateAndAuthorize from '@/middleware/authenticateAndAuthorize';
import upload from '@/middleware/profileUpload';

const router = Router();

router.post('/login', userController.login);

router.post('/google-login', userController.googleLogin);

router.post('/signup', userController.signup);

router.post('/send-otp', userController.verifySignUp);

router.post('/verify-otp', userController.verifyOtp);

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password', userController.resetPassword);

router.post(
  '/change-password',
  authenticateAndAuthorize(['customer']),
  userController.changePassword
);

router.post(
  '/upload-profile-picture',
  authenticateAndAuthorize(['customer']),
  upload.single('file'),
  userController.uploadProfilePicture
);

router.patch(
  '/update-profile',
  authenticateAndAuthorize(['customer']),
  userController.updateProfile
);

router.patch(
  '/:userId/block',
  authenticateAndAuthorize(['admin']),
  userController.blockUser
);

router.patch(
  '/:userId/allow',
  authenticateAndAuthorize(['admin']),
  userController.allowUser
);

router.post(
  '/address',
  authenticateAndAuthorize(['customer']),
  userController.addAddress
);

router.put(
  '/address/:addressId',
  authenticateAndAuthorize(['customer']),
  userController.editAddress
);

router.delete(
  '/address/:addressId',
  authenticateAndAuthorize(['customer']),
  userController.deleteAddress
);

router.get(
  '/referral-code',
  authenticateAndAuthorize(['customer']),
  userController.getReferralCode
);

export default router;
