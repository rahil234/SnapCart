export interface RazorpayWebhookPayload<TEvent extends string, TPayload> {
  entity: 'event';
  account_id: string;
  event: TEvent;
  contains: string[]; // Array of entities contained in the payload, e.g., ['payment', 'order']
  payload: TPayload;
  created_at: number; // Unix timestamp
}

// Define types for the nested entities first
interface RazorpayPaymentEntity {
  id: string;
  entity: 'payment';
  amount: number; // in the smallest currency unit (e.g., paise for INR)
  currency: string;
  status: 'captured' | 'authorized' | 'failed' | 'refunded';
  order_id: string | null;
  invoice_id: string | null;
  international: boolean;
  method: string; // e.g., 'card', 'netbanking', 'upi'
  amount_refunded: number;
  refund_status: string | null;
  captured: boolean;
  description: string | null;
  card_id: string | null;
  bank: string | null;
  wallet: string | null;
  vpa: string | null;
  email: string | null;
  contact: string | null;
  notes: Record<string, any>;
  fee: number;
  tax: number;
  error_code: string | null;
  error_description: string | null;
  error_source: string | null;
  error_step: string | null;
  error_reason: string | null;
  acquirer_data: Record<string, any>;
  created_at: number;
}

interface RazorpayOrderEntity {
  id: string;
  entity: 'order';
  amount: number;
  currency: string;
  receipt: string | null;
  status: 'created' | 'attempted' | 'paid';
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

// Now define the payload for payment.captured
interface PaymentCapturedPayload {
  payment: {
    entity: RazorpayPaymentEntity;
  };
  order?: {
    // Order is optional in some contexts
    entity: RazorpayOrderEntity;
  };
}

// Combine with the general webhook payload structure
export type PaymentCapturedWebhook = RazorpayWebhookPayload<
  'payment.captured',
  PaymentCapturedPayload
>;

// Combine with the general webhook payload structure
export type PaymentFailedWebhook = RazorpayWebhookPayload<
  'payment.failed',
  PaymentCapturedPayload
>;
