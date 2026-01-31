import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { OrderDto } from '@/application/order/dtos/order.dto';
import { Order } from '@/domain/order/entities/order.entity';
import { OrderItemDto } from '@/application/order/dtos/order-item.dto';
import { UserService } from '@/domain/user/services/user.service';
import { CreateOrderDto } from '@/application/order/dtos/create-order.dto';
import { AddressService } from '@/domain/user/services/address.service';
// Removed - use QueryBus instead
// import { VariantService } from '@/domain/product/services/variant.service';
import { UpdateOrderDto } from '@/application/order/dtos/request/update-order.dto';
import { OrderNumberService } from '@/domain/order/services/order-number.service';
import { IOrderRepository } from '@/infrastructure/order/repositories/order.repository';
import { OrderPaginatedQueryDto } from '@/application/order/dtos/request/order-paginated-query.dto';
import { QueryBus } from '@nestjs/cqrs';

@Injectable()
export class OrderService {
  constructor(
    @Inject('OrderRepository')
    private readonly _orderRepository: IOrderRepository,
    private readonly _userService: UserService,
    private readonly _addressService: AddressService,
    private readonly queryBus: QueryBus,
    private readonly _orderNumberService: OrderNumberService,
  ) {}

  public async create(
    dto: Pick<
      CreateOrderDto,
      'userId' | 'items' | 'subtotal' | 'total' | 'metadata' | 'discount'
    >,
  ): Promise<OrderDto> {
    for (const item of dto.items) {
      const product = await this._productService.findById(item.productId);

      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      let variantStock: number | null = null;

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);

        if (!variant)
          throw new BadRequestException(`Variant not found for product`);

        variantStock = variant.stock;

        if (variantStock < item.quantity) {
          throw new BadRequestException(
            `Not enough stock for variant ${product.name}. Available: ${variantStock}`,
          );
        }
      }
    }

    const userAddresses = await this._addressService.findByUserId(dto.userId);

    if (!userAddresses || userAddresses.length === 0) {
      throw new BadRequestException(`Shipping address not found for user`);
    }

    const shippingAddress = {
      houseNo: userAddresses[0].houseNo,
      street: userAddresses[0].street,
      city: userAddresses[0].city,
      state: userAddresses[0].state,
      pincode: userAddresses[0].pincode,
      country: userAddresses[0].country,
    };

    // -----------------------------------------
    // 🛒 2. Build order entity
    // -----------------------------------------

    const id = uuidv4();
    const orderNumber = await this._orderNumberService.generate();

    const entity = new Order({
      id,
      orderNumber,
      userId: dto.userId,
      subtotal: dto.subtotal,
      shippingCharge: 0,
      discount: dto.discount ?? 0,
      total: dto.total,
      items: dto.items,
      updatedAt: new Date(),
      metadata: dto.metadata ?? {},
      paymentMethod: null,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      shippingAddress,
      isDeleted: false,
    });

    const order = await this._orderRepository.create(entity);

    // -----------------------------------------
    // 📉 3. Reduce stock after order creation
    // -----------------------------------------
    for (const item of dto.items) {
      await this._variantService.decreaseStock(item.variantId, item.quantity);
    }

    const user = await this._userService.findById(order.userId);

    const items = await Promise.all(
      order.items.map(async (i) => {
        const product = await this._productService.findById(i.productId);
        const variant = await this._variantService.findById(i.variantId);
        return OrderItemDto.fromEntity(i, product, variant);
      }),
    );

    return OrderDto.fromEntity(order, user, items);
  }

  public async listAll(
    query: OrderPaginatedQueryDto,
  ): Promise<{ orders: OrderDto[]; total: number }> {
    const orderEntity = await this._orderRepository.findAll(query);

    const orders = await Promise.all(
      orderEntity.map(async (o) => {
        const user = await this._userService.findById(o.userId);

        const items = await Promise.all(
          o.items.map(async (i) => {
            const product = await this._productService.findById(i.productId);
            const variant = await this._variantService.findById(i.variantId);
            return OrderItemDto.fromEntity(i, product, variant);
          }),
        );

        return OrderDto.fromEntity(o, user, items);
      }),
    );

    return {
      orders,
      total: await this._orderRepository.countAll(),
    };
  }

  public async findById(id: string): Promise<OrderDto> {
    const order = await this._orderRepository.findById(id);
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    const user = await this._userService.findById(order.userId);

    const items = await Promise.all(
      order.items.map(async (i) => {
        const product = await this._productService.findById(i.productId);
        const variant = await this._variantService.findById(i.variantId);
        return OrderItemDto.fromEntity(i, product, variant);
      }),
    );

    return OrderDto.fromEntity(order, user, items);
  }

  public async findByOrderNumber(orderNumber: string): Promise<OrderDto> {
    const orderEntity =
      await this._orderRepository.findByOrderNumber(orderNumber);
    if (!orderEntity)
      throw new NotFoundException(`Order ${orderNumber} not found`);

    const user = await this._userService.findById(orderEntity.userId);

    const items = await Promise.all(
      orderEntity.items.map(async (i) => {
        const product = await this._productService.findById(i.productId);
        const variant = await this._variantService.findById(i.variantId);
        return OrderItemDto.fromEntity(i, product, variant);
      }),
    );

    return OrderDto.fromEntity(orderEntity, user, items);
  }

  public async listByUser(
    userId: string,
    query: OrderPaginatedQueryDto,
  ): Promise<{ orders: OrderDto[] }> {
    const orderEntities = await this._orderRepository.listByUser(userId, query);

    const orders = await Promise.all(
      orderEntities.map(async (o) => {
        const user = await this._userService.findById(o.userId);

        const items = await Promise.all(
          o.items.map(async (i) => {
            const product = await this._productService.findById(i.productId);
            const variant = await this._variantService.findById(i.variantId);
            return OrderItemDto.fromEntity(i, product, variant);
          }),
        );

        return OrderDto.fromEntity(o, user, items);
      }),
    );

    return {
      orders,
    };
  }

  public async update(id: string, payload: Partial<Order>): Promise<OrderDto> {
    const existing = await this._orderRepository.findById(id);

    if (!existing) throw new NotFoundException(`Order ${id} not found`);

    const updatableFields: Partial<Order> = {
      subtotal: payload.subtotal ?? existing.subtotal,
      shippingCharge: payload.shippingCharge ?? existing.shippingCharge,
      tax: payload.tax ?? existing.tax,
      discount: payload.discount ?? existing.discount,
      total: payload.total ?? existing.total,

      // Order status controls
      paymentStatus: payload.paymentStatus ?? existing.paymentStatus,
      orderStatus: payload.orderStatus ?? existing.orderStatus,

      // Address
      shippingAddress: payload.shippingAddress ?? existing.shippingAddress,

      // Metadata
      metadata: payload.metadata ?? existing.metadata,
      items: payload.items ?? existing.items,
    };

    const updated = existing.with(updatableFields);

    const data = await this._orderRepository.update(id, updated);

    const user = await this._userService.findById(data.userId);

    const items = await Promise.all(
      data.items.map(async (i) => {
        const product = await this._productService.findById(i.productId);
        const variant = await this._variantService.findById(i.variantId);
        return OrderItemDto.fromEntity(i, product, variant);
      }),
    );

    return OrderDto.fromEntity(data, user, items);
  }

  public async updateStatus(
    id: string,
    status: UpdateOrderDto['status'],
  ): Promise<OrderDto> {
    const existing = await this._orderRepository.findById(id);

    if (!existing) throw new NotFoundException(`Order ${id} not found`);

    const data = await this._orderRepository.update(id, {
      orderStatus: status ?? existing.orderStatus,
    });

    const user = await this._userService.findById(data.userId);

    if (status === 'delivered') {
      await this._userService.IncreaseTryOnLimit(user.id, 3);
    }

    const items = await Promise.all(
      data.items.map(async (i) => {
        const product = await this._productService.findById(i.productId);
        const variant = await this._variantService.findById(i.variantId);
        return OrderItemDto.fromEntity(i, product, variant);
      }),
    );

    return OrderDto.fromEntity(data, user, items);
  }

  public async cancelOrder(
    orderId: string,
    userId: string,
    reason?: string,
  ): Promise<OrderDto> {
    const order = await this.findById(orderId);

    if (order.customer.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (!['pending', 'processing'].includes(order.orderStatus)) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    return this.update(orderId, {
      orderStatus: 'canceled',
      cancelledAt: new Date(),
      metadata: { cancelReason: reason },
    });
  }

  async requestReturn(
    orderId: string,
    userId: string,
    reason?: string,
  ): Promise<OrderDto> {
    const order = await this.findById(orderId);

    if (order.customer.id !== userId) {
      throw new BadRequestException('Unauthorized');
    }

    if (order.orderStatus !== 'delivered') {
      throw new BadRequestException('Return allowed only after delivery');
    }

    return this.update(orderId, {
      orderStatus: 'return_requested',
      metadata: { returnReason: reason },
    });
  }

  async refundPayment(orderId: string): Promise<OrderDto> {
    const order = await this.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.orderStatus !== 'canceled' && order.orderStatus !== 'returned') {
      throw new BadRequestException(
        'Refund allowed only for canceled or returned orders',
      );
    }

    if (order.paymentStatus === 'refunded') {
      throw new BadRequestException('Order already refunded');
    }

    return this.update(orderId, {
      paymentStatus: 'refunded',
    });
  }
}
