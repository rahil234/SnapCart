import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IOtp extends Document {
  _id: ObjectId;
  email: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 60 },
  },
  { timestamps: true }
);

const otpModel = mongoose.model<IOtp>('Otp', OtpSchema);

export default otpModel;
