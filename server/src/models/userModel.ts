import mongoose, { Schema } from 'mongoose';
import { IUsers } from 'shared/types';

const UsersSchema: Schema = new Schema(
  {
    firstName: String,
    lastName: String,
    DOB: Date,
    phoneNo: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: Array,
    profilePicture: String,
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUsers>('User', UsersSchema);

export default userModel;
