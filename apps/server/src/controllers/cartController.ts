import { Request, Response } from 'express';
import cartModel from '@models/cartModel';
import productModel from '@models/productModel';
import { ICartP } from '@snapcart/shared/types';
import validateAndCalculateOfferPrice from '@/utils/validateAndCalculateOfferPrice';

const getCart = async (req: Request, res: Response) => {
  try {
    const cart = (await cartModel
      .findOne({ userId: req.user?._id })
      .populate({
        path: 'items.product',
        populate: {
          path: 'offer',
        },
      })
      .lean()) as unknown as ICartP;

    if (!cart) {
      res
        .status(200)
        .json({ cartData: { items: [], totalItems: 0, totalPrice: 0 } });
      return;
    }

    cart.items = cart.items.map(validateAndCalculateOfferPrice);
    // Calculate total price
    const totalPrice = cart.items.reduce((acc, item) => {
      const productPrice = item.product.price || 0;
      return acc + productPrice * item.quantity;
    }, 0);

    res.status(200).json({ cart, totalPrice });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const addItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    const product = await productModel.findById(productId).populate('offer');
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const availableStock = product.stock;

    const quantityToAdd = 1 > availableStock ? availableStock : 1;

    let cart = await cartModel.findOne({ userId: req.user?._id });

    if (cart) {
      const existingItem = cart.items.find(
        (item) => String(item.product) === String(productId)
      );

      if (existingItem) {
        res.status(200).json({
          message: 'Product already in cart',
          cart: await cart.populate('items.product'),
        });
        return;
      } else {
        cart.items.push({
          _id: product._id,
          product: product._id,
          quantity: quantityToAdd,
        });
      }

      // if (product.offer) {
      //   cart.totalAmount -=
      //     product.offer.type === 'Percentage'
      //       ? (product.price * product.offer.discount) / 100
      //       : product.offer.discount;
      // } else {
      // }
      cart.totalAmount += product.price;
      cart.totalItems += 1;

      await cart.save();
    } else {
      cart = new cartModel({
        userId: req.user?._id,
        items: [
          {
            _id: product._id,
            product: product._id,
            quantity: quantityToAdd,
          },
        ],
        totalAmount: product.price,
        totalItems: 1,
      });
      await cart.save();
    }

    const populatedCart = await cart.populate('items.product');

    res.status(200).json({
      message: 'Product added to cart',
      cart: populatedCart,
    });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const updateItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const adjustedQuantity =
      quantity > product.stock ? product.stock : quantity;

    const cartData = await cartModel.findOne({ userId: req.user?._id });

    let cart;
    if (cartData) {
      const item = cartData.items.find(
        (item) => String(item.product) === productId
      );
      if (item) {
        item.quantity = adjustedQuantity;
      } else {
        cartData.items.push({
          _id: productId,
          quantity: adjustedQuantity,
          product: productId,
        });
      }

      cart = await cartData.save();
    } else {
      const newCart = new cartModel({
        userId: req.user?._id,
        items: [
          {
            _id: productId,
            quantity: adjustedQuantity,
            product: productId,
          },
        ],
      });
      cart = await newCart.save();
    }

    const populatedCart = await cart.populate('items.product');

    res.status(200).json({ cart: populatedCart });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

const removeItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const cart = await cartModel.findOneAndUpdate(
      { userId: req.user?._id },
      { $pull: { items: { _id: productId } } },
      { new: true }
    );

    res.status(200).json({ cart: await cart?.populate('items.product') });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export default { getCart, addItem, removeItem, updateItem };
