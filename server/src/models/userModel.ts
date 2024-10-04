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

const UsersSchema: Schema = new Schema({
  FirstName: { type: String, required: true },
  CreatedAt: { type: Date, required: true },
  LastName: { type: String },
  DOB: { type: Date, required: true },
  PhoneNo: { type: Number },
  Email: { type: String, required: true, unique: true },
  UpdatedAt: { type: Date, required: true },
  Password: { type: String, required: true },
});

const Users = mongoose.model<IUsers>('Users', UsersSchema);

export default Users;
