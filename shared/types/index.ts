import { Document, Schema } from 'mongoose';

export interface Category {
  _id: string;
  name: string;
  status: string;
  soldCount: number;
}

export interface Subcategory {
  _id: string;
  name: string;
  status: 'Active' | 'Blocked';
  category: string;
  soldCount: number;
}

export type UserRole = 'admin' | 'customer' | 'seller';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  role: UserRole;
  addresses: [];
  profilePicture: string;
  status: 'Active' | 'Blocked';
}

export interface IReferal {
  code: string;
  referredBy?: string;
  referredUsers?: string[];
  referLimit: number;
}

export interface IUsers extends Document<string> {
  _id: string;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  addresses: Array<object>;
  email: string;
  walletBalance: number;
  password: string;
  profilePicture: string | null;
  status: 'Active' | 'Blocked';
  referral: IReferal;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeller extends Document<string> {
  _id: string;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  email: string;
  password: string;
  profilePicture: string | null;
  status: 'Active' | 'Blocked';
}

export interface IAdmin extends Document<string> {
  _id: string;
  firstName: string;
  email: string;
  password: string;
  profilePicture: string | null;
  status: 'Active' | 'Blocked';
}

//
// export interface Credentials {
//   email: string;
//   password: string;
// }

export type ObjectId = Schema.Types.ObjectId;

export interface ICart extends Document {
  userId?: string;
  items: Array<{
    _id: string;
    product: string;
    quantity: number;
  }>;
  totalAmount: number;
  totalItems: number;
}


interface ImportMetaEnv {
  readonly VITE_googleOAuthClientId: string;
  readonly VITE_BUCKET_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_imageUrl: string;
  readonly VITE_RAZORPAY_KEY_ID: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface catchError {
  code: number;
  name: string;
  message: string;
  response: {
    data: {
      message: string;
    };
  };
}

export interface IOrderItem {
  _id: string;
  name: string;
  quantity: number;
  seller: string;
  price: number;
  offerPrice: number;
  image: string;
  status?: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Return Approved' | 'Returned';
}

export interface IOrder extends Document {
  items: IOrderItem[];
  userId: string;
  customerName: string;
  orderId: string;
  address: [];
  paymentMethod: string;
  price: number;
  status:
    | 'Payment Pending'
    | 'Processing'
    | 'Pending'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Return Pending'
    | 'Return Requested'
    | 'Return Approved'
    | 'Return Cancelled'
    | 'Returned';
  orderDate: Date;
  discount: number;
  deliveryCharge: number;
  orderedBy: IUsers;
  createdAt: Date;
  updatedAt: Date;
}

// interface Offer {
//   _id: string;
//   title: string;
//   discount: number;
//   startDate: string;
//   type: 'percentage' | 'fixed';
//   products: string[];
//   categories: string[];
//   maxDiscount: number;
//   status: 'Active' | 'Inactive';
//   expiryDate: string;
// }

export interface IOffer {
  _id: string;
  title: string;
  type: 'Percentage' | 'Fixed';
  discount: number;
  startDate: Date;
  expiryDate: Date;
  applicableTo?: 'All' | 'Products' | 'Categories';
  products: string[];
  categories: string[];
  status: 'Active' | 'Inactive';
  limit: number;
  maxDiscount: number;
}

// export interface ICoupon {
//   _id: string;
//   code: string;
//   discount: number;
//   type: "percentage" | "fixed";
//   minAmount: number;
//   maxDiscount: number;
//   startDate: string;
//   endDate: string;
//   status: "Active" | "Inactive";
//   applicableTo: "All" | "Products" | "Categories";
//   products: string[];
//   categories: string[];
// }

export interface ICoupon {
  _id: string;
  code: string;
  discount: number;
  startDate: Date;
  endDate: Date;
  type: 'percentage' | 'fixed';
  status: 'Active' | 'Inactive';
  minAmount: number;
  maxDiscount: number;
  limit: number;
  applicableTo: 'All' | 'New' | 'Existing' | 'Exclusive';
}

export interface Address {
  id?: string;
  _id: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
}
