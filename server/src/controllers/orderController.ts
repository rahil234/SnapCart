import { Request, Response } from 'express';
import crypto from 'crypto';
import PDFDocument from 'pdfkit';
import cartModel from '@/models/cartModel';
import configRazorpay from '@/config/Razorpay';
import orderModel from '@models/orderModel';
import generateOrderId from '@/utils/generateOrderId';
import { ICartP, IOrderItem } from '@shared/types';
import userModel from '@models/userModel';
import couponModel from '@models/couponModel';
import productModel from '@models/productModel';
import walletModel from '@models/walletTransactionModel';
import fs from 'fs';
import path from 'path';
import categoryModel from '@models/categoryModel';
import subcategoryModel from '@models/subcategoryModel';

const razorpay = configRazorpay();

const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderModel
      .find({ orderedBy: req.user?._id })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getOrder = async (req: Request, res: Response) => {
  try {
    console.log(req.params.orderId);
    const order = await orderModel.findOne({
      orderedBy: req.user?._id,
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
    const allOrders = await orderModel.find().sort({ orderDate: -1 });
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

const getAdminOrders = async (_req: Request, res: Response) => {
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

    const couponDoc = await couponModel.findOne({ code: coupon });

    let discount = 0;
    if (coupon) {
      if (!couponDoc) {
        res.status(400).json({ message: 'Invalid coupon' });
        return;
      }

      //   const currentDate = new Date();
      //   if (
      //     couponDoc.status !== 'Active' ||
      //     couponDoc.startDate > currentDate ||
      //     couponDoc.endDate < currentDate
      //   ) {
      //     res.status(400).json({ message: 'Coupon is not valid at this time' });
      //     return;
      //   }
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

    if (paymentMethod === 'cod' && cart.totalAmount > 1000) {
      res
        .status(400)
        .json({ message: 'COD is not available for orders above 1000' });
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

    totalPrice -= Math.round(discount);

    const deliveryCharge = totalPrice > 500 ? 0 : 50;

    totalPrice += deliveryCharge;

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

      await walletModel.create({
        userId: req.user?._id,
        amount: -totalPrice,
        description: 'Order payment #' + orderId,
        type: 'debit',
      });
    }

    cart.items.forEach(async (item) => {
      await productModel.updateOne(
        { _id: item.product._id },
        {
          stock: item.product.stock - item.quantity,
          soldCount: item.product.soldCount + item.quantity,
        }
      );
      await categoryModel.updateOne(
        { _id: item.product.category },
        { $inc: { soldCount: item.quantity } }
      );
      await subcategoryModel.updateOne(
        { _id: item.product.subcategory },
        { $inc: { soldCount: item.quantity } }
      );
    });

    const order = new orderModel({
      orderedBy: req.user?._id,
      orderId,
      address,
      paymentMethod,
      items: orderItems,
      price: totalPrice,
      deliveryCharge,
      discount,
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

  console.log('payment order ', order);

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

const getReceipt = async (req: Request, res: Response) => {
  try {
    const order = await orderModel.findOne({
      orderedBy: req.user?._id,
      orderId: req.params.orderId,
    });

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const doc = new PDFDocument();
    const receiptPath = path.join(__dirname, `receipt-${order.orderId}.pdf`);
    const writeStream = fs.createWriteStream(receiptPath);

    doc.pipe(writeStream);

    doc.fontSize(20).text('Order Receipt', { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Order ID: ${order.orderId}`);
    doc.text(`User ID: ${order.orderedBy}`);
    doc.text(`Order Date: ${order.orderDate}`);
    doc.text(`Total Amount: ${order.price}`);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    order.items.forEach((item: IOrderItem, index: number) => {
      doc.text(
        `${index + 1}. ${item.name} - ${item.quantity} x ${item.price} = ${
          item.quantity * item.price
        }`
      );
    });

    doc.text(`\nTotal: ${order.price}`);
    doc.end();

    writeStream.on('finish', () => {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="receipt-${order.orderId}.pdf"`
      );

      res.sendFile(receiptPath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({ message: 'Error sending receipt' });
        }
        fs.unlink(receiptPath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting temporary file:', unlinkErr);
          }
        });
      });
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to file:', err);
      res.status(500).json({ message: 'Error generating receipt' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId, status } = req.body;
    const orders = await orderModel.findOne({ orderId });

    if (!orders) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    orders.items.forEach(async (item) => {
      item.status = status;
    });
    orders.status = status;
    await orders.save();

    res.status(200).json({ message: 'Order status updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
  getReceipt,
  updateOrderStatus,
};
