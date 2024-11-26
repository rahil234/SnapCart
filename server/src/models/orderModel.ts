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
    enum: ['Processing', 'Pending', 'Shipped', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
});

const orderSchema = new Schema<IOrder>(
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
      enum: ['Payment Pending', 'Pending', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    discount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 0 },
    orderDate: { type: Date, default: Date.now },
    orderedBy: { type: String, ref: 'User' },
  },
  {
    autoIndex: true,
    timestamps: true,
  }
);

const orderModel = model<IOrder>('Order', orderSchema);

export default orderModel;
