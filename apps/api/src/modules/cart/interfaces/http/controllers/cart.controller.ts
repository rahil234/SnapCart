import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
  AddItemToCartCommand,
  ApplyCouponToCartCommand,
  ClearCartCommand,
  RemoveItemFromCartCommand,
  UpdateCartItemCommand,
} from '@/modules/cart/application/commands';
import { Role } from '@/shared/enums/role.enum';
import {
  CartItemResponseDto,
  CartPricingDto,
} from '@/modules/cart/interfaces/http/dto/response';
import { Roles } from '@/shared/decorators/roles.decorator';
import { ParseCUIDPipe } from '@/shared/pipes/parse-cuid.pipe';
import { UserId } from '@/shared/decorators/user-id.decorator';
import { HttpResponse } from '@/shared/dto/common/http-response.dto';
import { ApiResponseWithType } from '@/shared/decorators/api-response.decorator';
import { ApplyCouponDto } from '@/modules/cart/interfaces/http/dto/request/apply-coupon.dto';
import { GetCartPricingQuery } from '@/modules/cart/application/queries/get-cart-pricing.query';
import { AddItemToCartDto } from '@/modules/cart/interfaces/http/dto/request/add-item-to-cart.dto';
import { UpdateCartItemDto } from '@/modules/cart/interfaces/http/dto/request/update-cart-item.dto';
import { GetCartWithDetailsQuery } from '@/modules/cart/application/queries/get-cart-with-details.query';
import { CartWithDetailsResponseDto } from '@/modules/cart/interfaces/http/dto/response/cart-with-details-response.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
export class CartController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Get user cart with product details' })
  @ApiResponseWithType(
    {
      status: 200,
      description: 'Cart retrieved successfully with full product details',
    },
    CartWithDetailsResponseDto,
  )
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCart(
    @UserId() userId: string,
  ): Promise<HttpResponse<CartWithDetailsResponseDto>> {
    const cart = await this.queryBus.execute(
      new GetCartWithDetailsQuery(userId),
    );

    return {
      message: 'Cart retrieved successfully',
      data: CartWithDetailsResponseDto.fromDomain(cart),
    };
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponseWithType(
    {
      status: 201,
      description: 'Item added to cart successfully',
    },
    CartItemResponseDto,
  )
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async addItem(
    @UserId() userId: string,
    @Body() dto: AddItemToCartDto,
  ): Promise<HttpResponse<CartItemResponseDto>> {
    const cartItem = await this.commandBus.execute(
      new AddItemToCartCommand(
        userId,
        dto.productId,
        dto.productVariantId,
        dto.quantity,
      ),
    );
    return {
      message: 'Item added to cart successfully',
      data: CartItemResponseDto.fromDomain(cartItem),
    };
  }

  @Put('items/:itemId')
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  @ApiResponseWithType(
    {
      status: 200,
      description: 'Item quantity updated successfully',
    },
    CartItemResponseDto,
  )
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to modify this item',
  })
  async updateItem(
    @UserId() userId: string,
    @Param('itemId', ParseCUIDPipe) itemId: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<HttpResponse<CartItemResponseDto>> {
    const cartItem = await this.commandBus.execute(
      new UpdateCartItemCommand(userId, itemId, dto.quantity),
    );

    return {
      message: 'Item quantity updated successfully',
      data: CartItemResponseDto.fromDomain(cartItem),
    };
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiParam({ name: 'itemId', description: 'Cart item ID' })
  @ApiResponseWithType({
    status: 204,
    description: 'Item removed successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to modify this item',
  })
  async removeItem(
    @UserId() userId: string,
    @Param('itemId', ParseCUIDPipe) itemId: string,
  ): Promise<HttpResponse> {
    await this.commandBus.execute(
      new RemoveItemFromCartCommand(userId, itemId),
    );

    return {
      message: 'Item removed from cart successfully',
    };
  }

  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiResponseWithType({
    status: 204,
    description: 'Cart cleared successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async clearCart(@UserId() userId: string): Promise<HttpResponse> {
    await this.commandBus.execute(new ClearCartCommand(userId));
    return {
      message: 'Cart cleared successfully',
    };
  }

  @Get('pricing')
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Get cart pricing with offers and optional coupon',
    description:
      'Calculate cart pricing including active offers and optional coupon discount. Returns complete breakdown of all discounts.',
  })
  @ApiQuery({
    name: 'couponCode',
    required: false,
    description: 'Coupon code to apply for pricing calculation',
    example: 'SAVE20',
  })
  @ApiResponseWithType(
    {
      status: 200,
      description: 'Cart pricing calculated successfully',
    },
    CartPricingDto,
  )
  @ApiResponse({ status: 404, description: 'Cart not found' })
  async getCartPricing(
    @UserId() userId: string,
    @Query('couponCode') couponCode?: string,
  ): Promise<HttpResponse<CartPricingDto>> {
    const pricing = await this.queryBus.execute(
      new GetCartPricingQuery(userId, couponCode),
    );

    return {
      message: 'Cart pricing calculated successfully',
      data: pricing,
    };
  }

  @Post('apply-coupon')
  @Roles(Role.CUSTOMER)
  @ApiOperation({
    summary: 'Apply coupon to cart',
    description: 'Validate and apply a coupon code to the cart',
  })
  @ApiResponseWithType({
    status: 200,
    description: 'Coupon applied successfully',
  })
  @ApiResponse({ status: 404, description: 'Cart or coupon not found' })
  @ApiResponse({ status: 400, description: 'Invalid coupon or cart is empty' })
  async applyCoupon(
    @UserId() userId: string,
    @Body() dto: ApplyCouponDto,
  ): Promise<HttpResponse> {
    await this.commandBus.execute(
      new ApplyCouponToCartCommand(userId, dto.code),
    );

    return {
      message: 'Coupon validated successfully',
    };
  }
}
