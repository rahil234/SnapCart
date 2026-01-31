export interface IOrder {
  _id: string;
  orderId: string;
  user: any;
  items: any[];
  totalAmount: number;
  payment: any;
  status:
    | 'Payment Pending'
    | 'Pending'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Return Requested'
    | 'Return Pending'
    | 'Return Cancelled'
    | 'Returned';
  shippingAddress: any;
  coupon?: any;
  createdAt: Date;
  updatedAt: Date;
}
