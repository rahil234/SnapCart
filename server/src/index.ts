import express from 'express';
import '@/config/configEnv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectToDatabase from '@/config/mongoDB';
import connectToRedis from '@/config/redis';
import logger from '@/middleware/logger';
import authRoute from '@/routes/authRoute';
import userRoute from '@/routes/userRoute';
import sellerRoute from '@/routes/sellerRoute';
import adminRoute from '@/routes/adminRoute';
import productRoute from '@/routes/productRoute';
import categoryRoute from '@/routes/categoryRoute';
import orderRoute from '@/routes/orderRoute';
import cartRoute from '@/routes/cartRoute';
import walletRoute from '@/routes/walletRoute';
import offerRoute from '@/routes/offerRoute';
import salesRoute from '@/routes/salesRoute';
import couponRoute from '@/routes/couponRoute';
import limiter from '@/config/rateLimmiter';
import helmet from 'helmet';
import errorHandler from '@/middleware/errorHandler';

const app = express();

(async () => {
  await connectToDatabase();
  await connectToRedis();

  app.use(helmet());

  app.use(
    cors({
      origin: ['http://localhost:5173', 'https://www.snapcart.website'],
      credentials: true,
    })
  );

  if (process.env.NODE_ENV === 'production') {
    app.use(await limiter());
  }

  app.use(logger());

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

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

  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server ✅: Running on port ${PORT}`);
  });
})();
