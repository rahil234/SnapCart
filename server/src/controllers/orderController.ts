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
import fs from 'fs';
import path from 'path';
import createWalletTransaction from '@/utils/generateWalletTransaction';
import validateAndCalculateOfferPrice from '@/utils/validateAndCalculateOfferPrice';

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
    const allOrders = await orderModel
      .find()
      .sort({ orderDate: -1 })
      .populate('orderedBy', 'firstName email')
      .lean();
    const orders = allOrders.filter((order) =>
      order.items.some((item) => item.seller === req.user?._id)
    );

    orders.forEach((order) => {
      order.items = order.items.filter((item) => item.seller === req.user?._id);
    });

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAdminOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await orderModel
      .find()
      .sort({ orderDate: -1 })
      .populate('orderedBy', 'firstName email')
      .lean();

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

    if (!addresses || !paymentMethod) {
      res.status(400).json({ message: 'Invalid data' });
      return;
    }

    const address: Array<string> = [];

    console.log('addresses', addresses[0]);
    for (const addr in addresses[0]) {
      if (addr !== '_id') {
        address.push(addresses[0][addr]);
      }
    }

    const cart = (await cartModel
      .findOne({ userId: req.user?._id })
      .populate('items.product')) as unknown as ICartP;

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: 'Cart is empty' });
      return;
    }

    if (paymentMethod === 'cod' && cart.totalAmount > 1000) {
      console.log(cart.totalAmount);
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

    cart?.items.map(validateAndCalculateOfferPrice).forEach((item) => {
      orderItems.push({
        _id: item._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        offerPrice: item.offerPrice || item.product.price,
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
          message: 'Insufficient wallet balance choose another payment method',
        });
        return;
      }

      await userModel.findByIdAndUpdate(req.user?._id, {
        $inc: { walletBalance: -totalPrice },
      });

      await createWalletTransaction(
        totalPrice,
        'Order payment #' + orderId,
        'debit',
        req.user?._id
      );
    }

    if (paymentMethod !== 'razorpay') {
      for (const item of cart.items) {
        await productModel.updateOne(
          { _id: item.product._id },
          {
            $inc: { stock: -item.quantity },
          }
        );
      }
    }

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
    await cartModel.updateOne(
      { userId: req.user?._id },
      { items: [], totalAmount: 0 }
    );
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
      const order = await orderModel.findOne({ orderId });
      if (!order) {
        res.status(404).json({ message: 'Order not found' });
        return;
      }
      order.status = 'Pending';

      for (const item of order.items) {
        await productModel.updateOne(
          { _id: item._id },
          {
            $inc: { stock: -item.quantity },
          }
        );
      }

      await order.save();
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
      $inc: { walletBalance: item.price * item.quantity },
    });
    await createWalletTransaction(
      item.price,
      'Refund for order item cancellation',
      'credit',
      req.user?._id
    );

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

const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findOne({ orderId });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    await userModel.findByIdAndUpdate(req.user?._id, {
      $inc: { walletBalance: order.price },
    });

    await createWalletTransaction(
      order.price,
      'Refund for order item cancellation',
      'credit',
      req.user?._id
    );

    order.status = 'Cancelled';

    for (const item of order.items) {
      item.status = 'Cancelled';
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const returnOrder = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    console.log('return order', req.body);
    const order = await orderModel.findOne({ orderId });
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.status = 'Return Requested';

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// const getReceipt = async (req: Request, res: Response) => {
//   try {
//     const order = await orderModel.findOne({
//       orderedBy: req.user?._id,
//       orderId: req.params.orderId,
//     });
//
//     if (!order) {
//       res.status(404).json({ message: 'Order not found' });
//       return;
//     }
//
//     const doc = new PDFDocument();
//     const receiptPath = path.join(__dirname, `receipt-${order.orderId}.pdf`);
//     const writeStream = fs.createWriteStream(receiptPath);
//
//     doc.pipe(writeStream);
//
//     doc.fontSize(20).text('Order Receipt', { align: 'center' });
//     doc.moveDown();
//
//     doc.fontSize(14).text(`Order ID: #${order.orderId}`);
//     doc.text(`User ID: ${order.orderedBy}`);
//     doc.text(`Order Date: ${order.orderDate}`);
//     doc.text(`Total Amount: ${order.price}`);
//     doc.moveDown();
//
//     doc.text('Items:', { underline: true });
//     order.items.forEach((item: IOrderItem, index: number) => {
//       doc.text(
//         `${index + 1}. ${item.name} - ${item.quantity} x ${item.price} = ${
//           item.quantity * item.price
//         }`
//       );
//     });
//
//     doc.text(`\nTotal: ${order.price}`);
//     doc.end();
//
//     writeStream.on('finish', () => {
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader(
//         'Content-Disposition',
//         `attachment; filename="receipt-${order.orderId}.pdf"`
//       );
//
//       res.sendFile(receiptPath, (err) => {
//         if (err) {
//           console.error('Error sending file:', err);
//           res.status(500).json({ message: 'Error sending receipt' });
//         }
//         fs.unlink(receiptPath, (unlinkErr) => {
//           if (unlinkErr) {
//             console.error('Error deleting temporary file:', unlinkErr);
//           }
//         });
//       });
//     });
//
//     writeStream.on('error', (err) => {
//       console.error('Error writing to file:', err);
//       res.status(500).json({ message: 'Error generating receipt' });
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const getReceipt = async (req: Request, res: Response) => {
  try {
    const order = await orderModel
      .findOne({
        orderedBy: req.user?._id,
        orderId: req.params.orderId,
      })
      .populate('orderedBy');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const doc = new PDFDocument();
    const receiptPath = path.join(__dirname, `receipt-${order.orderId}.pdf`);
    const writeStream = fs.createWriteStream(receiptPath);

    doc.pipe(writeStream);

    // Title
    doc.fontSize(20).text('Order Receipt', { align: 'center' });
    doc.moveDown();

    // Order Details
    doc.fontSize(14).text(`Order ID: #${order.orderId}`);
    doc.text(`Order Date: ${order.orderDate.toDateString()}`);
    doc.text(`Total Amount: ${order.price}`);
    doc.moveDown();

    // Shipping and Billing Information
    doc.text('Shipping Address:', { underline: true });
    doc.text(`${order.orderedBy.firstName}`);
    doc.text(`${order.address.join('\n')}`);
    doc.moveDown();

    doc.text('Billing Address:', { underline: true });
    doc.text(`${order.orderedBy.firstName}`);
    doc.text(`${order.address.join('\n')}`);
    doc.moveDown();

    // Payment Method
    doc.text('Payment Method:', { underline: true });
    doc.text(order.paymentMethod);
    doc.moveDown();

    // Order Items
    doc.text('Items:', { underline: true });
    order.items.forEach((item: IOrderItem, index: number) => {
      doc.text(
        `${index + 1}. ${item.name} - ${item.quantity} x ${item.price} = ${
          item.quantity * item.price
        }`
      );
    });

    // Total
    doc.text(`\nTotal: ₹${order.price}`);
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
    const { status } = req.body;
    const { orderId } = req.params;
    console.log('status', status, orderId);
    const orders = await orderModel.findOne({ orderId });

    if (!orders) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    if (
      status !== 'Payment Pending' &&
      status !== 'Processing' &&
      status !== 'Return Pending' &&
      status !== 'Return Requested' &&
      status !== 'Return Approved' &&
      status !== 'Returned'
    ) {
      console.log('status', status);
      for (const item of orders.items) {
        item.status = status;
      }
    }
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
  cancelOrder,
  returnOrder,
};
