import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface ISeller extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  email: string;
  password: string;
  status: 'Active' | 'Blocked';
}

const UsersSchema: Schema = new Schema(
  {
    firstName: String,
    lastName: String,
    DOB: Date,
    phoneNo: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' }, // Add status field with default value
  },
  { timestamps: true }
);

const sellerModel = mongoose.model<ISeller>('Sellers', UsersSchema);

export default sellerModel;