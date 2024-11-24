import mongoose from 'mongoose';

const connectToDatabase = async (): Promise<void> => {
  try {
    const DATABASE_URL = process.env.MONGODB_URI || 'mongo://localhost:27017';

    await mongoose.connect(DATABASE_URL);
    console.log('MongoDB ✅: Connected to database ' + DATABASE_URL);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};
export default connectToDatabase;
