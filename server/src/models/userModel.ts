import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IUsers extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  email: string;
  password: string;
  status: 'Active' | 'Blocked'; // Add status field
}

const UsersSchema: Schema = new Schema(
  {
    firstName: String,
    lastName: String, // Corrected typo from lastNameastName to lastName
    DOB: Date,
    phoneNo: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' }, // Add status field with default value
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUsers>('Users', UsersSchema);

export default userModel;
