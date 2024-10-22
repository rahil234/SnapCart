export interface Product {
    _id: string;
    name: string;
    price: number;
    quantity: string;
    stock: number;
    status: 'Active' | 'Inactive';
    reviews: Array<Review>;
    images: string[];
    variants: object[];
    description: string;
    category: Category;
    subcategory: Subcategory;
}
interface Review {
    _id: string;
    user: string;
    date: string;
    rating: number;
    comment: string;
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
    status: 'Active' | 'Blocked';
}
export type UserRole = 'admin' | 'user' | 'seller';
export interface User {
    id: string;
    name: string;
    email: string;
    DOB: string;
}
export interface Seller {
    _id: string;
    name: string;
    email: string;
    DOB: string;
}
export interface Credentials {
    email: string;
    password: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
interface ImportMetaEnv {
    readonly VITE_googleOAuthClientId: string;
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
export {};
