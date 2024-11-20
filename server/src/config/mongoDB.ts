import mongoose from 'mongoose';

const connectToDatabase = async (): Promise<void> => {
  try {
    const DATABASE_URL =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/SnapCart';

    console.log('connecting to database url:', DATABASE_URL);

    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB ✅: Connected to database');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
export default connectToDatabase;
