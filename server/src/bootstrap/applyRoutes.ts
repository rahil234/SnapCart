import type { Express } from 'express';

import cartRoute from '@/routes/cartRoute';
import authRoute from '@/routes/authRoute';
import userRoute from '@/routes/userRoute';
import salesRoute from '@/routes/salesRoute';
import offerRoute from '@/routes/offerRoute';
import adminRoute from '@/routes/adminRoute';
import orderRoute from '@/routes/orderRoute';
import couponRoute from '@/routes/couponRoute';
import walletRoute from '@/routes/walletRoute';
import sellerRoute from '@/routes/sellerRoute';
import productRoute from '@/routes/productRoute';
import categoryRoute from '@/routes/categoryRoute';

export function applyRoutes(app: Express) {
  app.get('/', (_req, res) => {
    res.send('Welcome to Snapcart API');
  });

  app.use('/api/auth', authRoute);
  app.use('/api/user', userRoute);
  app.use('/api/seller', sellerRoute);
  app.use('/api/admin', adminRoute);
  app.use('/api/product', productRoute);
  app.use('/api/category', categoryRoute);
  app.use('/api/order', orderRoute);
  app.use('/api/cart', cartRoute);
  app.use('/api/wallet', walletRoute);
  app.use('/api/offer', offerRoute);
  app.use('/api/coupon', couponRoute);
  app.use('/api/sales', salesRoute);
}
