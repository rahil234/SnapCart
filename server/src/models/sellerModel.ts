import mongoose, { Schema } from 'mongoose';
import { ISeller } from 'shared/types';

const UsersSchema: Schema = new Schema(
  {
    firstName: String,
    lastName: String,
    DOB: Date,
    phoneNo: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: String,
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' }, // Add status field with default value
  },
  { timestamps: true }
);

const sellerModel = mongoose.model<ISeller>('Seller', UsersSchema);

export default sellerModel;
