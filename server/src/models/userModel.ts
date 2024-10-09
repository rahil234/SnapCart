import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface IUsers extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  email: string;
  Password: string;
}

const UsersSchema: Schema = new Schema(
  {
    firstName: String,
    lastNameastName: String,
    DOB: Date,
    phoneNo: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUsers>('Users', UsersSchema);

export default userModel;
