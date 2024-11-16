import { Schema, model } from 'mongoose';
import { IOrder, IOrderItem } from 'shared/types';

const orderItemSchema = new Schema<IOrderItem>({
  _id: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  seller: { type: String, required: true },
  image: { type: String, required: true },
  status: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing',
  },
});

const orderSchema = new Schema<IOrder>(
  {
    items: { type: [orderItemSchema], required: true },
    userId: { type: String, required: true },
    customerName: String,
    orderId: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    address: [{ type: String, required: true }],
    status: {
      type: String,
      required: true,
      enum: ['Payment Pending', 'Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    orderDate: { type: Date, default: Date.now },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

const orderModel = model<IOrder>('Order', orderSchema);

export default orderModel;
