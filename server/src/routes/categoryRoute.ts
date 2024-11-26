import { Router } from 'express';
import categoryController from '@/controllers/categoryController';

const categoryRoute = Router();

categoryRoute.get('/get-categories', categoryController.getCategories);

categoryRoute.post('/add-category', categoryController.addCategory);

categoryRoute.patch('/edit-categories', categoryController.editCategories);

categoryRoute.patch('/archive-category', categoryController.archiveCategory);

categoryRoute.get('/top-categories', categoryController.getTopCategories);

categoryRoute.patch(
  '/unarchive-category',
  categoryController.unarchiveCategory
);

export default categoryRoute;
