import express from 'express';
import '@/config/configEnv';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import connectToDatabase from '@/config/mongoDB';
import connectToRedis from '@/config/redis';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import sellerRoute from './routes/sellerRoute';
import adminRoute from './routes/adminRoute';
import productRoute from './routes/productRoute';
import categoryRoute from './routes/categoryRoute';
import orderRoute from './routes/orderRoute';
import cartRoute from './routes/cartRoute';
import walletRoute from './routes/walletRoute';
import offerRoute from '@/routes/offerRoute';
import salesRoute from '@/routes/salesRoute';
import couponRoute from '@/routes/couponRoute';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173', 'https://www.snapcart.website'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '/images')));

app.use((req, _res, next) => {
  const currentTime = `${new Date().toLocaleTimeString('en-US', { hour12: false })}.${new Date().getMilliseconds()}`;
  const method = req.method;
  const url = req.url;

  console.log(`${currentTime} ${method}: ${url}`);
  next();
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

const PORT = process.env.PORT || 3000;

(async () => {
  await connectToDatabase();
  await connectToRedis();

  app.listen(PORT, () => {
    console.log(`Server ✅: Running on port ${PORT}`);
  });
})();
