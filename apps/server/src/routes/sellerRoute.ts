import { Router } from 'express';
import sellerController from '@/controllers/sellerController';

const sellerRoute = Router();

sellerRoute.post('/login', sellerController.sellerLogin);

sellerRoute.post('/add-sellers', sellerController.addSeller);

sellerRoute.patch('/:userId/block', sellerController.blockSeller);

sellerRoute.patch('/:userId/allow', sellerController.allowSeller);

export default sellerRoute;
