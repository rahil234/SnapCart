import { Schema, model } from 'mongoose';
import { IOrder, IOrderItem } from '@snapcart/shared/types';

const orderItemSchema = new Schema<IOrderItem>({
  _id: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  seller: { type: String, required: true },
  image: { type: String, required: true },
  status: {
    type: String,
    enum: ['Processing', 'Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
});

const orderSchema = new Schema(
  {
    items: { type: [orderItemSchema], required: true },
    customerName: String,
    orderId: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    address: [{ type: String, required: true }],
    status: {
      type: String,
      required: true,
      enum: [
        'Payment Pending',
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
        'Return Requested',
        'Return Pending',
        'Return Cancelled',
        'Returned',
      ],
      default: 'Processing',
    },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    orderDate: { type: Date, default: Date.now },
    orderedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

const orderModel = model<IOrder>('Order', orderSchema);

export default orderModel;
