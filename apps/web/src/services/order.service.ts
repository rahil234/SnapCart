import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import {
  AdminOrdersApi,
  OrdersCustomerApi,
  SellerOrdersApi,
  UpdateOrderStatusDto,
} from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const ordersApi = new OrdersCustomerApi(apiConfig, undefined, apiClient);

const sellerOrdersApi = new SellerOrdersApi(apiConfig, undefined, apiClient);

const adminOrdersApi = new AdminOrdersApi(apiConfig, undefined, apiClient);

export const OrderService = {
  getMyOrders: () =>
    handleRequest(() => ordersApi.customerOrderControllerGetMyOrders()),
  getSellerOrders: () =>
    handleRequest(() => sellerOrdersApi.sellerOrderControllerGetSellerOrders()),
  getAdminOrders: () =>
    handleRequest(() => adminOrdersApi.adminOrderControllerGetAllOrders()),
  getOrder: (orderId: string) =>
    handleRequest(() =>
      adminOrdersApi.adminOrderControllerGetOrderById(orderId)
    ),
  verifyCheckout: () =>
    handleRequest(() => orderApi.orderControllerVerifyCheckout()),
  createPayment: (paymentData: CreatePaymentDto) =>
    handleRequest(() => orderApi.orderControllerCreatePayment(paymentData)),
  verifyPayment: (paymentData: VerifyPaymentDto) =>
    handleRequest(() => orderApi.orderControllerVerifyPayment(paymentData)),
  updateOrderStatus: (orderId: string, statusData: UpdateOrderStatusDto) =>
    handleRequest(() =>
      adminOrdersApi.adminOrderControllerUpdateOrderStatus(orderId, statusData)
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
