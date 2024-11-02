import { Request, Response } from 'express';
import cartModel from '@models/cartModel';
import userModel from '@models/userModel';
import productModel from '@models/productModel';
import { ICart } from '@shared/types';

const getCart = async (req: Request, res: Response) => {
  try {
    const cart = await cartModel
      .findOne({ userId: req.user?._id })
      .populate('items.product');

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// const addItem = async (req: Request, res: Response) => {
//   try {
//     const { productId } = req.body;
//     const userId = req.user?._id;

//     let cart = await cartModel.findOne({ userId });

//     if (cart) {
//       const item = cart.items.find((item) => item.productId === productId);
//       if (item) {
//         item.quantity += 1;
//       } else {
//         cart.items.push({ productId, quantity: 1 });
//       }
//     } else {
//       cart = new cartModel({ userId, items: [{ productId, quantity: 1 }] });
//     }
//     await cart.save();

//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ error: (error as Error).message });
//   }
// };

// const getCart = async (req: Request, res: Response) => {
//   try {
//     const cart = await cartModel.findOne({ userId: req.user?._id }).populate({
//       path: 'items.productId',
//       select: 'name price images',
//       model: 'Product',
//     });
//     res.status(200).json({ message: 'success', cart });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };
// type newType = ICart extends Document ? ICart : ICart & Document;

// interface CustomICart extends Omit<ICart, 'items'>, Document {
//   items: Array<{ _id: ObjectId; quantity: number; product: string }>;
// }

const addItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;

    const user = await userModel.findById(req.user?._id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const product = await productModel.findById(productId);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const cart = (await cartModel.findOne({ userId: user._id })) as ICart;

    if (cart) {
      const existingItem = cart.items.find((item) => item._id === productId);

      if (existingItem) {
        console.log('existingItem', existingItem);
        existingItem.quantity += 1;
        await cartModel.updateOne(
          { userId: user._id },
          { items: existingItem }
        );
      } else {
        cart.items.push({
          _id: product._id,
          product: product._id,
          quantity: 1,
        });
      }
      cart.totalPrice += product.price;
      await cart.save();
    } else {
      const newCart = new cartModel({
        userId: user._id,
        items: [
          {
            _id: product._id,
            product: product._id,
            quantity: 1,
          },
        ],
        totalPrice: product.price,
      });

      await newCart.save();
    }

    res.status(200).json({ message: 'Product added to cart', quantity: 2 });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

const removeItem = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const cart = await cartModel.updateOne(
      { userId: req.user?._id },
      { $pull: { items: { _id: productId } } }
    );
    console.log('cart', cart);

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const updateItem = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartModel.updateOne(
      { userId: req.user?._id, 'items.productId': productId },
      { $set: { 'items.$.quantity': quantity } }
    );
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export default { getCart, addItem, removeItem, updateItem };
