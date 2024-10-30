import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAdmin extends Document {
  _id: ObjectId;
  firstName: string;
  email: string;
  password: string;
  status: 'Active' | 'Blocked';
}

const AdminSchema: Schema = new Schema(
  {
    firstName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
  },
  { timestamps: true }
);

const adminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default adminModel;
