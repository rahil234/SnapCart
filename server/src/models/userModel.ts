import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface IUsers extends Document {
  _id: ObjectId;
  FirstName: string;
  CreatedAt: Date;
  LastName: string | null;
  DOB: Date;
  PhoneNo: number | null;
  Email: string;
  UpdatedAt: Date;
  Password: string;
}

const UsersSchema: Schema = new Schema(
  {
    FirstName: String,
    LastName: String,
    DOB: Date,
    PhoneNo: Number,
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
  },
  { timestamps: true }
);

const Users = mongoose.model<IUsers>('Users', UsersSchema);

export default Users;
