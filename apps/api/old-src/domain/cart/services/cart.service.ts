import {
  Injectable,
  NotFoundException,
  Inject,
  BadRequestException,
} from '@nestjs/common';

import { CartDto } from '@/application/cart/dtos/cart.dto';
import { OrderDto } from '@/application/order/dtos/order.dto';
import { Cart } from '@/domain/cart/entities/cart.entity';
import { CartItemDto } from '@/application/cart/dtos/cart-item.dto';
import { OrderItem } from '@/domain/order/entities/order.entity';
import { UpdateCartDto } from '@/application/cart/dtos/update-cart.dto';
import { CreateCartDto } from '@/application/cart/dtos/create-cart.dto';
import { OrderService } from '@/domain/order/services/order.service';
// Removed - use QueryBus instead
// import { VariantService } from '@/domain/product/services/variant.service';
import { ProductService } from '@/domain/product/services/product.service';
import { RazorpayService } from '@/domain/payment/services/razorpay.service';
import type { CartRepository } from '@/infrastructure/cart/repositories/cart.repository';
import type { CartItemRepository } from '@/infrastructure/cart/repositories/cart-item.repository';

@Injectable()
export class CartService {
  constructor(
    @Inject('CartRepository') private readonly _cartRepository: CartRepository,
    @Inject('CartItemRepository')
    private readonly _cartItemRepository: CartItemRepository,
    private readonly queryBus: QueryBus,
    private readonly _paymentService: RazorpayService,
    private readonly _orderService: OrderService,
  ) {}

  async createCart(userId: string) {
    return this._cartRepository.createCart(userId);
  }

  async addToCart(userId: string, dto: CreateCartDto): Promise<CartItemDto> {
    const { variantId, quantity } = dto;

    const variant = await this._variantService.findById(variantId);
    if (!variant) throw new NotFoundException('Product or Variant not found');

    if (variant.stock <= 0) {
      throw new BadRequestException('Product is out of stock');
    }

    let cart = await this._cartRepository.findByUserId(userId);
    if (!cart) cart = await this.createCart(userId);

    const existingItem = await this._cartItemRepository.findExistingItem(
      cart.id,
      variant.productId,
      variantId,
    );

    if (quantity > variant.stock) {
      throw new BadRequestException(
        `Only ${variant.stock} items available in stock`,
      );
    }

    const cartItem = existingItem
      ? await this._cartItemRepository.updateQuantity(existingItem.id, {
          quantity,
        })
      : await this._cartItemRepository.addToCart(cart.id, {
          productId: variant.productId,
          variantId,
          quantity,
        });

    return CartItemDto.fromEntity(
      cartItem,
      await this._productService.findById(cartItem.productId),
      variant,
    );
  }

  async findByUserId(userId: string): Promise<CartDto> {
    let cart = await this._cartRepository.findByUserId(userId);

    if (!cart) {
      cart = await this.createCart(userId);
    }

    const cartItems = await Promise.all(
      cart.items.map(async (item) => {
        const variant = await this._variantService.findById(item.variantId);

        if (!variant) {
          throw new NotFoundException('Variant not found');
        }

        const product = await this._productService.findById(variant.productId);

        return {
          ...item,
          product,
          variant,
        };
      }),
    );

    return CartDto.fromEntity(cart, cartItems);
  }

  async updateQuantity(
    userId: string,
    itemId: string,
    dto: UpdateCartDto,
  ): Promise<CartItemDto> {
    const { quantity } = dto;

    const item = await this._cartItemRepository.findItemById(itemId);

    if (!item) throw new NotFoundException('Cart item not found');

    if (quantity <= 0) return this.removeItem(userId, itemId);

    const variant = await this._variantService.findById(item.variantId);

    if (!variant) throw new NotFoundException('Variant not found');

    if (quantity > variant.stock) {
      throw new BadRequestException(
        `Insufficient stock for the product. Available stock: ${variant.stock}`,
      );
    }

    const cartItem = await this._cartItemRepository.updateQuantity(itemId, {
      quantity,
    });

    return CartItemDto.fromEntity(
      cartItem,
      await this._productService.findById(cartItem.productId),
      await this._variantService.findById(cartItem.variantId),
    );
  }

  async removeItem(userId: string, itemId: string): Promise<CartItemDto> {
    const cart = await this._cartRepository.findByUserId(userId);

    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart?.items.find((item) => {
      console.log(item.id, itemId);
      return item.id === itemId;
    });

    // const item = await this._cartItemRepository.findItemById(itemId);

    console.log(cart, 'item', item);

    if (!item) throw new NotFoundException('Item not found in this cart');

    const cartItem = await this._cartItemRepository.removeItem(itemId);

    return CartItemDto.fromEntity(
      cartItem,
      await this._productService.findById(cartItem.productId),
      await this._variantService.findById(cartItem.variantId),
    );
  }

  async clearCart(cartId: string) {
    await this._cartItemRepository.clearCart(cartId);
    return { message: 'Cart cleared successfully' };
  }

  private async _buildItemsAndAmount(
    cart: Cart,
  ): Promise<{ amount: number; items: OrderItem[] }> {
    let amount = 0;
    const items: OrderItem[] = [];

    for (const item of cart.items) {
      const variant = await this._variantService.findById(item.variantId);
      if (!variant) throw new NotFoundException('Variant not found');

      const product = await this._productService.findById(variant.productId);
      if (!product) throw new NotFoundException('Product not found');

      if (variant.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${variant.stock}`,
        );
      }

      const unitPrice = product.discountPrice;
      const lineTotal = unitPrice * item.quantity;
      amount += lineTotal;

      items.push({
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        subtotal: lineTotal,
      });
    }

    return { amount, items };
  }

  private async _processCheckout(userId: string): Promise<OrderDto> {
    const cart = await this._cartRepository.findByUserId(userId);

    if (!cart) throw new NotFoundException('Cart not found');

    const { amount, items } = await this._buildItemsAndAmount(cart);

    const order = await this._orderService.create({
      userId,
      subtotal: amount,
      total: amount,
      items,
      metadata: { cartId: cart.id },
    });

    await this.clearCart(cart.id);

    return order;
  }

  async checkout(userId: string) {
    const order = await this._processCheckout(userId);

    return this._paymentService.createOrder(userId, order.total, 'INR', {
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  }

  async checkoutLink(userId: string) {
    const order = await this._processCheckout(userId);

    return this._paymentService.createPaymentLink(userId, order.total, 'INR', {
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  }
}
