import { Document, Schema } from "mongoose";

interface Review {
  _id: string;
  user: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Product {
  _id: string;
  name: string;
  category: { _id: string; name: string };
  subcategory: { _id: string; name: string };
  price: number;
  variantId: string;
  variantName: string;
  stock: number;
  images: string[];
  description?: string;
  tags?: string[];
  discount?: number;
  seller: string;
  status: "Active" | "Inactive";
  variants?: Variant[];
  reviews?: Review[];
  soldCount: number;
}

export interface Category {
  _id: string;
  name: string;
  status: string;
  subcategory: Subcategory;
}

export interface Subcategory {
  _id: string;
  name: string;
  status: "Active" | "Blocked";
}

export type UserRole = "admin" | "customer" | "seller";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  DOB: string;
  role: UserRole;
  addresses: [];
  profilePicture: string;
  status: "Active" | "Blocked";
}

export interface IUsers extends Document {
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
  status: "Active" | "Blocked";
}

export interface ISeller extends Document {
  _id: string;
  firstName: string;
  lastName: string | null;
  DOB: Date;
  phoneNo: number | null;
  email: string;
  password: string;
  profilePicture: string | null;
  status: "Active" | "Blocked";
}

export interface IAdmin extends Document {
  _id: string;
  firstName: string;
  email: string;
  password: string;
  profilePicture: string | null;
  status: "Active" | "Blocked";
}

export interface Credentials {
  email: string;
  password: string;
}

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

export interface ICartP {
  userId?: string;
  items: Array<{
    _id: string;
    product: Product;
    quantity: number;
  }>;
  totalAmount: number;
  totalItems: number;
}

export interface CartItem {
  _id: string;
  quantity: number;
  product: Product;
}

export interface Variant {
  id: string;
  // productId: string;
  variantName: string;
  price: string;
  stock: string;
  images: VariantImage[];
}

export interface VariantImage {
  id: number;
  file: File;
  preview: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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
  image: string;
  status?: "Processing" | "Shipped" | "Completed" | "Cancelled";
}

export interface IOrder extends Document {
  items: IOrderItem[];
  userId: string;
  customerName: string;
  orderId: string;
  address: string;
  paymentMethod: string;
  price: number;
  status:
    | "Payment Pending"
    | "Processing"
    | "Pending"
    | "Shipped"
    | "Completed"
    | "Cancelled";
  orderDate: Date;
  discount: number;
  deliveryCharge: number;
  orderedBy: String;
  createdAt: Date;
  updatedAt: Date;
}

export interface Offer {
  _id: string;
  title: string;
  discount: number;
  startDate: string;
  endDate: string;
  products: string[];
  categories: string[];
  status: "Active" | "Inactive";
}

export interface ICoupon {
  _id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive";
  applicableTo: "All" | "Products" | "Categories";
  products: string[];
  categories: string[];
}


// export interface ICart {
//   _id: string;
//   userId: string;
//   items: Array<{
//     _id: string;
//     productId: Product ;
//     quantity: number;
//   }>;
//   totalPrice: number;
// }

// type Result<T extends string> = T extends 'customer' ? IUsers : Seller | IAdmin;
// export type customer='customer'
// export type admin='admin'
// export type seller='seller'
// export function processInput(
//   role: customer | admin | seller,
//   user: unknown
// ) {
//   if (role === 'customer') {
//     return user as IUsers;
//   }else if(role === 'seller'){
//     return user as Seller
//   }else{
//     return user as IAdmin  }

// }

// export interface Category {
//   name: string;
//   categoryId: string;
//   products: Product[];
//   subcategories: Subcategory[];
// }

// export interface Subcategory {
//   subcategory: string;
//   subcategoryId: string;
//   products: Product[];
// }

// export interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   quantity: string;
//   stock: number;
//   status: 'Active' | 'Inactive';
//   reviews: Array<Review>;
//   images: string[];
//   variants: object[];
//   description: string;
//   category: Category;
//   subcategory: Subcategory;
// }

// export interface ISeller extends Document {
//   _id: string;
//   firstName: string;
//   profilePicture: string;
//   email: string;
//   DOB: string;
//   status: 'Active' | 'Blocked';
// }
