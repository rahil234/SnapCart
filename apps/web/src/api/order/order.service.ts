import { apiConfig } from '@/api/client';
import { OrderApi } from '@/api/generated';

import { handleRequest } from '@/api/utils/handleRequest';

const orderApi = new OrderApi(apiConfig);

export const OrderService = {
  getOrders: () => handleRequest(() => orderApi.orderControllerFindAll()),
  getSellerOrders: () =>
    handleRequest(() => orderApi.orderControllerFindSellerOrders()),
  getAdminOrders: () =>
    handleRequest(() => orderApi.orderControllerFindAdminOrders()),
  getOrder: (orderId: string) =>
    handleRequest(() => orderApi.orderControllerFindOne(orderId)),
  createOrder: (orderData: CreateOrderDto) =>
    handleRequest(() => orderApi.orderControllerCreate(orderData)),
  verifyCheckout: () =>
    handleRequest(() => orderApi.orderControllerVerifyCheckout()),
  createPayment: (paymentData: CreatePaymentDto) =>
    handleRequest(() => orderApi.orderControllerCreatePayment(paymentData)),
  verifyPayment: (paymentData: VerifyPaymentDto) =>
    handleRequest(() => orderApi.orderControllerVerifyPayment(paymentData)),
  updateOrderStatus: (orderId: string, statusData: UpdateOrderStatusDto) =>
    handleRequest(() =>
      orderApi.orderControllerUpdateStatus(orderId, statusData)
    ),
  cancelOrder: (orderId: string) =>
    handleRequest(() => orderApi.orderControllerCancel(orderId)),
  cancelOrderItem: (orderId: string, itemId: string) =>
    handleRequest(() => orderApi.orderControllerCancelItem(orderId, itemId)),
  getInvoice: (orderId: string) =>
    handleRequest(() =>
      orderApi.orderControllerDownloadInvoice(orderId, {
        responseType: 'blob',
      })
    ),
  submitReturnRequest: (orderId: string, data: ReturnRequestDto) =>
    handleRequest(() =>
      orderApi.orderControllerReturnOrder(orderId, returnData)
    ),
};
