import mongoose, { Schema } from 'mongoose';
import { IUsers } from 'shared/types';

const AddressSchema: Schema = new Schema(
  {
    street: String,
    city: String,
    state: String,
    pinCode: {
      type: Number,
      required: true,
      validate: {
        validator: function (value: number) {
          return /^\d{6}$/.test(value.toString());
        },
        message: (props: any) =>
          `${props.value} is not a valid 6-digit pin code!`,
      },
    },
  },
  { _id: true }
);

const ReferralSchema: Schema = new Schema(
  {
    code: String,
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    referredUsers: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    referLimit: { type: Number, default: 5 },
  },
  { _id: false }
);

const UsersSchema: Schema = new Schema(
  {
    firstName: String,
    lastName: String,
    DOB: Date,
    phoneNo: Number,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    walletBalance: { type: Number, default: 0 },
    addresses: {
      type: [AddressSchema],
      default: [],
    },
    profilePicture: String,
    status: { type: String, enum: ['Active', 'Blocked'], default: 'Active' },
    referral: { type: ReferralSchema, unique: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model<IUsers>('User', UsersSchema);

export default userModel;
