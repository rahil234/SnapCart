import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IAdmin extends Document {
  _id: ObjectId;
  firstName: string;
  email: string;
  password: string;
}

const AdminSchema: Schema = new Schema(
  {
    firstName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const adminModel = mongoose.model<IAdmin>('Admin', AdminSchema);

export default adminModel;
