import {
  AdminOrdersApi,
  CreatePaymentDto,
  OrdersCustomerApi,
  PaymentApi,
  SellerOrdersApi,
  UpdateOrderStatusDto,
  VerifyPaymentDto,
} from '@/api/generated';
import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const ordersApi = new OrdersCustomerApi(apiConfig, undefined, apiClient);
const sellerOrdersApi = new SellerOrdersApi(apiConfig, undefined, apiClient);
const adminOrdersApi = new AdminOrdersApi(apiConfig, undefined, apiClient);
const paymentApi = new PaymentApi(apiConfig, undefined, apiClient);

export const OrderService = {
  getMyOrders: () =>
    handleRequest(() => ordersApi.customerOrderControllerGetMyOrders()),
  getSellerOrders: () =>
    handleRequest(() => sellerOrdersApi.sellerOrderControllerGetSellerOrders()),
  getAdminOrders: () =>
    handleRequest(() => adminOrdersApi.adminOrderControllerGetAllOrders()),
  getOrderDetails: (orderId: string) =>
    handleRequest(() => ordersApi.customerOrderControllerGetOrderById(orderId)),
  getAdminOrder: (orderId: string) =>
    handleRequest(() =>
      adminOrdersApi.adminOrderControllerGetOrderById(orderId)
    ),
  createPayment: (paymentData: CreatePaymentDto) =>
    handleRequest(() => paymentApi.paymentControllerCreatePayment(paymentData)),
  verifyPayment: (paymentData: VerifyPaymentDto) =>
    handleRequest(() => paymentApi.paymentControllerVerifyPayment(paymentData)),
  updateOrderStatus: (orderId: string, statusData: UpdateOrderStatusDto) =>
    handleRequest(() =>
      adminOrdersApi.adminOrderControllerUpdateOrderStatus(orderId, statusData)
    ),
  cancelOrder: (
    orderId: string,
    cancelReason: string = 'Customer requested cancellation'
  ) =>
    handleRequest(() =>
      ordersApi.customerOrderControllerCancelOrder(orderId, { cancelReason })
    ),
};
