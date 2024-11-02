import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute';
import userRoute from './routes/userRoute';
import sellerRoute from './routes/sellerRoute';
import adminRoute from './routes/adminRoute';
import productRoute from './routes/productRoute';
import categoryRoute from './routes/categoryRoute';
import cartRoute from './routes/cartRoute';
// import deliveryRoute from './routes/delivery.route';

dotenv.config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use(express.static(path.join(__dirname, '/images')));

app.use((req: Request, res: Response, next: NextFunction) => {
  const currentTime =
    new Date().toLocaleTimeString('en-US', { hour12: false }) +
    '.' +
    new Date().getMilliseconds();
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
app.use('/api/cart', cartRoute);
// app.get('/api/delivery', deliveryRoute);

const PORT = process.env.PORT || 3000;

const connectToDatabaseAndStartServer = async () => {
  try {
    const DATABASE_URL =
      process.env.MONGODB_URI || 'mongodb://mongo:27017/SnapCart';
    console.log('connecting to database url:', DATABASE_URL);

    await mongoose.connect(DATABASE_URL);
    console.log('Database ✅: Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server   ✅: Running on port ${PORT}`);
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

connectToDatabaseAndStartServer();
