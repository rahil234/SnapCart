import { Router } from 'express';
import upload from '../middleware/upload';
import adminController from '@/controllers/adminController';

const adminRoute = Router();

adminRoute.post('/create-admin', adminController.createAdmin);

adminRoute.post('/login', adminController.adminLogin);

adminRoute.get('/get-products', adminController.getProducts);

adminRoute.get('/get-banners', adminController.getBanners);

adminRoute.patch(
  '/upload-banner-image',
  upload.single('image'),
  adminController.uploadBannerImage
);

adminRoute.patch('/update-banner-order', adminController.updateBannerOrder);

adminRoute.post('/save-banners', adminController.saveBanners);

adminRoute.get('/get-users', adminController.getUsers);

adminRoute.get('/get-sellers', adminController.getSellers);

adminRoute.post('/add-sellers', adminController.addSeller);

adminRoute.delete('/delete-banner/:bannerId', adminController.deleteBanner);

export default adminRoute;
