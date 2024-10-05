import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoute from './routes/userRoute';
import sellerRoute from './routes/sellerRoute';
import adminRoute from './routes/adminRoute';
// import deliveryRoute from './routes/delivery.route';

dotenv.config();

const app = express();

// Configure CORS to allow requests from your frontend domain
app.use(
  cors({
    origin: 'https://www.snapcart.website', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    credentials: true, // Allow cookies and authorization headers
  })
);

app.use(express.json());

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
app.use('/api/admin', sellerRoute);
app.use('/api/admin', adminRoute);
// app.get('/api/admin', deliveryRoute);

const PORT = process.env.PORT || 3001;

const connectToDatabaseAndStartServer = async () => {
  try {
    const DATABASE_URL =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/SnapCart';
    // await mongoose.connect(DATABASE_URL);
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
