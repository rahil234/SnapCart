import mongoose, { Schema } from 'mongoose';
import { IAdmin } from 'shared/types';

const AdminSchema: Schema = new Schema(
  {
    firstName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
  },
  { timestamps: true }
);

const adminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default adminModel;
