export interface RazorpayOptions {
  key: string;
  amount?: number;
  currency?: string;
  name?: string;
  description?: string;
  image?: string;
  order_id: string;

  handler(response: RazorpayResponse): void;

  modal: {
    ondismiss(): void;
  };
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
  orderId: string;
}

export interface RazorpayInstance {
  open(): void;
  on(event: string, callback: (response: never) => void): void;
}

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}
