import { Request, Response } from 'express';
import crypto from 'crypto';
import cartModel from '@/models/cartModel';
import configRazorpay from '@/config/Razorpay';
import orderModel from '@models/orderModel';
import generateOrderId from '@/utils/generateOrderId';
import { ICartP, IOrderItem } from '@shared/types';
import userModel from '@models/userModel';
import couponModel from '@models/couponModel';
import productModel from '@models/productModel';

const razorpay = configRazorpay();

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

const getSellerOrders = async (req: Request, res: Response) => {
  try {
    const allOrders = await orderModel.find();
    const orders = allOrders.filter((order) =>
      order.items.some((item) => item.seller === req.user?._id)
    );

    orders.forEach((order) => {
      order.items = order.items.filter((item) => item.seller === req.user?._id);
    });

    console.log(orders);
    res.status(200).json(orders);
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
    const { addresses, paymentMethod, coupon } = req.body;

    if (coupon) {
      console.log(coupon);
    }

    const couponDoc = await couponModel.findOne({ code: coupon });

    let discount = 0;
    if (coupon) {
      if (!couponDoc) {
        res.status(400).json({ message: 'Invalid coupon' });
        return;
      }

      const currentDate = new Date();
      if (
        couponDoc.status !== 'Active' ||
        couponDoc.startDate > currentDate ||
        couponDoc.endDate < currentDate
      ) {
        res.status(400).json({ message: 'Coupon is not valid at this time' });
        return;
      }
    }

    const address = Object.values(addresses[0]);

    if (!addresses || !paymentMethod) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }

    const cart = (await cartModel
      .findOne({ userId: req.user?._id })
      .populate('items.product')) as unknown as ICartP;

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

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

    const orderId = generateOrderId();

    const orderItems = [] as IOrderItem[];
    let totalPrice = 0;

    cart?.items.forEach((item) => {
      orderItems.push({
        _id: item._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        seller: item.product.seller,
        image: item.product.images[0],
      });
      totalPrice += item.product.price * item.quantity;
    });

    if (couponDoc) {
      if (couponDoc.type === 'fixed') {
        discount = couponDoc.discount;
      } else if (couponDoc.type === 'percentage') {
        discount = (couponDoc.discount / 100) * totalPrice;
      }
    }
    console.log(discount);
    totalPrice -= discount;
    console.log(totalPrice);

    if (paymentMethod === 'wallet') {
      const walletBalance = (await userModel.findById(req.user?._id))
        ?.walletBalance;

      if (!walletBalance || walletBalance - totalPrice < 0) {
        res.status(400).json({
          message: 'Insufficient wallet balance choose another payment methoed',
        });
        return;
      }

      await userModel.findByIdAndUpdate(req.user?._id, {
        $inc: { walletBalance: -totalPrice },
      });
    }

    cart.items.forEach(async (item) => {
      await productModel.updateOne(
        { _id: item.product._id },
        { stock: item.product.stock - item.quantity }
      );
    });

    const order = new orderModel({
      userId: req.user?._id,
      orderId,
      address,
      paymentMethod,
      items: orderItems,
      price: totalPrice,
      status: paymentMethod === 'razorpay' ? 'Payment Pending' : 'Pending',
    });

    await order.save();
    await cartModel.updateOne({ userId: req.user?._id }, { items: [] });
    res.status(201).json({ orderId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createPayment = async (req: Request, res: Response) => {
  const { orderId } = req.body;
  if (!orderId) {
    res.status(400).json({ message: 'Invalid order id' });
    return;
  }
  const order = await orderModel.findOne({ orderId });
  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  const options = {
    amount: order.price * 100,
    currency: 'INR',
    receipt: 'order_rcptid_11',
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyPayment = async (req: Request, res: Response) => {
  try {
    console.log('verifypay ', req.body);
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

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
      await orderModel.updateOne({ orderId }, { status: 'Pending' });
      res
        .status(200)
        .json({ message: 'Payment verification Success', orderId });
    } else {
      res.status(400).json({ message: 'Payment verification failed', orderId });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};

const cancelOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderId, itemId } = req.params;
    const order = await orderModel.findOne({ orderId });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    const item = order.items.find((item) => item._id.toString() === itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found in order' });
      return;
    }

    await userModel.findByIdAndUpdate(req.user?._id, {
      $inc: { walletBalance: item.price },
    });

    item.status = 'Cancelled';

    const allItemsCancelled = order.items.every(
      (item) => item.status === 'Cancelled'
    );
    if (allItemsCancelled) {
      order.status = 'Cancelled';
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  getOrders,
  getSellerOrders,
  getAdminOrders,
  getOrder,
  verifyCheckout,
  createOrder,
  createPayment,
  verifyPayment,
  cancelOrderItem,
};
