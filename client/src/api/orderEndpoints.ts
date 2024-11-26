import axiosInstance from './axiosInstance';

const getOrders = async () => {
  return (await axiosInstance.get('/api/order')).data;
};

const getSellerOrders = async () => {
  return (await axiosInstance.get('/api/order/seller')).data;
};

const getAdminOrders = async () => {
  return (await axiosInstance.get('/api/order/admin')).data;
};

const getOrder = async (orderId: string) => {
  return axiosInstance.get(`/api/order/${orderId}`);
};

const createOrder = async (orderData: object, coupon: string | undefined) => {
  return axiosInstance.post('/api/order', { ...orderData, coupon });
};

const verifyCheckout = async () => {
  return axiosInstance.get('/api/order/verify-checkout');
};

const createPayment = async (orderId: string) => {
  return axiosInstance.post('/api/order/create-payment', { orderId });
};

const verifyPayment = async (response: object) => {
  return (await axiosInstance.post('/api/order/verify-payment', response)).data;
};

const updateOrder = async (data: { orderId: number; orderData: object }) => {
  return (await axiosInstance.put(`/order/${data.orderId}`, data.orderData))
    .data;
};

const updateOrderStatus = async (data: { orderId: string; status: string }) => {
  return (await axiosInstance.put(`/api/order/${data.orderId}/status`, data))
    .data;
};

const deleteOrder = async (orderId: string) => {
  return axiosInstance.delete(`/api/order/${orderId}`);
};

const cancelOrderItem = async (orderId: string, itemId: string) => {
  return axiosInstance.delete(`/api/order/${orderId}/items/${itemId}`);
};

const applyCoupon = async (coupon: string) => {
  return (await axiosInstance.post('/api/coupon/apply', { coupon })).data;
};

const getInvoice = async (orderId: string) => {
  return axiosInstance.get(`/api/order/${orderId}/receipt`, {
    responseType: 'blob',
  });
};

export default {
  getOrders,
  getOrder,
  getAdminOrders,
  getSellerOrders,
  createOrder,
  verifyCheckout,
  createPayment,
  verifyPayment,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
  cancelOrderItem,
  applyCoupon,
  getInvoice,
};
