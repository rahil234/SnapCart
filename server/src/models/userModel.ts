import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUsers extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  email: string;
  password: string;
  profilePicture: string | null;
  status: 'Active' | 'Blocked';
  __v: number;
}

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

const userModel = mongoose.model<IUsers>('User', UsersSchema);

export default userModel;
