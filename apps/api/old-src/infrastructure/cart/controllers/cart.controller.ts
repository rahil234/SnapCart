import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { Role } from '@/common/enums/role.enum';
import { CreateCartDto } from '@/application/cart/dtos/create-cart.dto';
import { UpdateCartDto } from '@/application/cart/dtos/update-cart.dto';
import { CartService } from '@/domain/cart/services/cart.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { HttpResponse } from '@/common/dto/http-response.dto';
import { UserId } from '@/common/decorators/user-id.decorator';
import { CartResponseDto } from '@/application/cart/dtos/response/cart.response.dto';
import { ApiResponseWithType } from '@/common/decorators/api-response.decorator';
import { CartItemResponseDto } from '@/application/cart/dtos/response/cart-item.response.dto';
import { CheckoutCartResponseDto } from '@/application/cart/dtos/response/checkout-cart.response.dto';
import { CheckoutCartLinkResponseDto } from '@/application/cart/dtos/response/checkout-cart-link.response.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly _cartService: CartService) {}

  @Get()
  @Roles(Role.USER)
  @ApiResponseWithType({}, CartResponseDto)
  async getUserCart(
    @UserId() userId: string,
  ): Promise<HttpResponse<CartResponseDto>> {
    const data = await this._cartService.findByUserId(userId);

    return {
      message: 'Cart retrieved successfully',
      success: true,
      data: CartResponseDto.fromEntity(data),
    };
  }

  @Post('add')
  @Roles(Role.USER)
  @ApiResponseWithType({}, CartItemResponseDto)
  async addToCart(
    @UserId() userId: string,
    @Body() dto: CreateCartDto,
  ): Promise<HttpResponse<CartItemResponseDto>> {
    const data = await this._cartService.addToCart(userId, dto);

    return {
      message: 'Item added to cart successfully',
      success: true,
      data: CartItemResponseDto.fromDto(data),
    };
  }

  @Patch(':itemId')
  @Roles(Role.USER)
  @ApiResponseWithType({}, CartItemResponseDto)
  async updateQuantity(
    @UserId() userId: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartDto,
  ): Promise<HttpResponse<CartItemResponseDto>> {
    console.log('update quantity dto', dto);
    const data = await this._cartService.updateQuantity(userId, itemId, dto);
    return {
      message: 'Cart item quantity updated successfully',
      success: true,
      data: CartItemResponseDto.fromDto(data),
    };
  }

  @Delete(':itemId')
  @Roles(Role.USER)
  @ApiResponseWithType({
    type: 'boolean',
  })
  async removeItem(
    @UserId() userId: string,
    @Param('itemId') itemId: string,
  ): Promise<HttpResponse<boolean>> {
    const data = await this._cartService.removeItem(userId, itemId);

    return {
      message: 'Item removed from cart successfully',
      success: true,
      data: Boolean(data),
    };
  }

  @Post('checkout')
  @Roles(Role.USER)
  @ApiResponseWithType({}, CheckoutCartResponseDto)
  async checkout(
    @UserId() userId: string,
  ): Promise<HttpResponse<CheckoutCartResponseDto>> {
    const data = await this._cartService.checkout(userId);

    return {
      message: 'Cart checkout initiated successfully',
      success: true,
      data: new CheckoutCartResponseDto(data),
    };
  }

  @Post('checkout/link')
  @Roles(Role.USER)
  @ApiResponseWithType({}, CheckoutCartLinkResponseDto)
  async checkoutLink(
    @UserId() userId: string,
  ): Promise<HttpResponse<CheckoutCartLinkResponseDto>> {
    const data = await this._cartService.checkoutLink(userId);

    return {
      message: 'Cart checkout initiated successfully',
      success: true,
      data: new CheckoutCartLinkResponseDto(data),
    };
  }
}
