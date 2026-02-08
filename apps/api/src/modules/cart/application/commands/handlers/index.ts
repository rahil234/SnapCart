import { CreateCartHandler } from './create-cart.handler';
import { AddItemToCartHandler } from './add-item-to-cart.handler';
import { UpdateCartItemHandler } from './update-cart-item.handler';
import { RemoveItemFromCartHandler } from './remove-item-from-cart.handler';
import { ClearCartHandler } from './clear-cart.handler';

export const CartCommandHandlers = [
  CreateCartHandler,
  AddItemToCartHandler,
  UpdateCartItemHandler,
  RemoveItemFromCartHandler,
  ClearCartHandler,
];
