// src/razorpay-types.ts

export interface RazorpayOptions {
   key: string;
   amount: number;
   currency: string;
   name?: string;
   description?: string;
   image?: string;
   order_id: string;
   handler(response: RazorpayResponse): void;
   prefill?: RazorpayPrefill;
   theme?: RazorpayTheme;
}

export interface RazorpayPrefill {
   name?: string;
   email?: string;
   contact?: string;
}

export interface RazorpayTheme {
   color?: string;
}

export interface RazorpayResponse {
   razorpay_payment_id: string;
   razorpay_order_id: string;
   razorpay_signature: string;
}

export interface RazorpayInstance {
   open(): void;
   on(event: string, callback: (response: any) => void): void;
}

declare global {
   interface Window {
      Razorpay: {
         new (options: RazorpayOptions): RazorpayInstance;
      };
   }
}