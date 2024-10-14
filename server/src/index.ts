import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// import fs from 'fs';

import userRoute from './routes/userRoute';
import sellerRoute from './routes/sellerRoute';
import adminRoute from './routes/adminRoute';
// import deliveryRoute from './routes/delivery.route';

dotenv.config();

const app = express();

// Configure CORS to allow requests from your frontend domain
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(express.json());

app.use(express.static('/uploads'));

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

app.use('/api/user', userRoute);
app.use('/api/seller', sellerRoute);
app.use('/api/admin', adminRoute);
// app.get('/api/admin', deliveryRoute);

const PORT = 3000;

const connectToDatabaseAndStartServer = async () => {
  try {
    const DATABASE_URL =
      process.env.MONGODB_URI || 'mongodb://mongo:27017/snapcart';
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
