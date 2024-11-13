import axiosInstance from './axiosInstance';

const getOrders = async () => {
  return axiosInstance.get('/api/order');
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

const createOrder = async (orderData: object) => {
  return axiosInstance.post('/api/order', orderData);
};

const verifyCheckout = async () => {
  return axiosInstance.get('/api/order/verify-checkout');
};

const createPayment = async (orderData: object) => {
  return axiosInstance.post('/api/order/create-payment', orderData);
};

const verifyPayment = async (response: object) => {
  return axiosInstance.post('/api/order/verify-payment', response);
};

const updateOrder = async (data: { orderId: number; orderData: object }) => {
  return (await axiosInstance.put(`/orders/${data.orderId}`, data.orderData))
    .data;
};

const updateOrderStatus = async (data: { orderId: string; status: string }) => {
  return (await axiosInstance.put(`/orders/${data.orderId}/status`, data)).data;
};

const deleteOrder = async (orderId: string) => {
  return axiosInstance.delete(`/orders/${orderId}`);
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
};
