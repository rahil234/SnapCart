import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import cartModel from '@/models/cartModel';
import orderModel from '@models/orderModel';
import generateOrderId from '@/utils/generateOrderId';
import { ICartP } from '@shared/types';
import productModel from '@models/productModel';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_1',
});

const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find({ userId: req.user?._id });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await orderModel.findOne({
      userId: req.user?._id,
      orderId: req.params.orderId,
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAdminOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel.find();
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const verifyCheckout = async (req: Request, res: Response) => {
  let stockerror = {};

  const cart = (await cartModel
    .findOne({ userId: req.user?._id })
    .populate('items.product')) as unknown as ICartP;

  cart.items.forEach((item) => {
    if (item.quantity > item.product.stock) {
      stockerror = { ...stockerror, [item.product.name]: item.product.stock };
    }
  });

  if (Object.keys(stockerror).length !== 0) {
    res.status(400).json({ message: 'Stock error', error: stockerror });
    return;
  }

  res.status(200).json({ message: 'Checkout successful' });
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const cart = (await cartModel
      .findOne({ userId: req.user?._id })
      .populate('items.product')) as unknown as ICartP;

    let stockerror = {};

    cart.items.forEach((item) => {
      if (item.quantity > item.product.stock) {
        stockerror = { ...stockerror, [item.product.name]: item.product.stock };
      }
    });

    if (Object.keys(stockerror).length !== 0) {
      res.status(400).json({
        message: 'Stock error',
        error: stockerror,
      });
      return;
    }

    cart.items.forEach(async (item) => {
      await productModel.updateOne(
        { _id: item.product._id },
        { stock: item.product.stock - item.quantity }
      );
    });

    const orderId = generateOrderId();
    const order = new orderModel({
      userId: req.user?._id,
      orderId: orderId,
      price: cart.totalAmount,
    });
    cart?.items.forEach((item) => {
      order.items.push({
        _id: item._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      });
    });
    await order.save();
    await cartModel.updateOne({ userId: req.user?._id }, { items: [] });
    res.status(201).json({ orderId });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const createPayment = async (req: Request, res: Response) => {
  const cart = await cartModel.findById(req.params.id);

  const options = {
    amount: (cart?.totalAmount ? cart?.totalAmount : 1) * 100,
    currency: 'INR',
    receipt: 'order_rcptid_11',
  };
  try {
    const order = await razorpay.orders.create(options);
    console.log(order);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400).send('Payment verification failed');
  }

  const SECRET_KEY = process.env.RAZORPAY_KEY_SECRET;

  if (!SECRET_KEY) {
    res.status(500).send('Internal server error');
    return;
  }

  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    res.status(200).send('Payment verified successfully');
  } else {
    res.status(400).send('Payment verification failed');
  }
};

export default {
  getOrders,
  getAdminOrders,
  getOrder,
  verifyCheckout,
  createOrder,
  createPayment,
  verifyPayment,
};
