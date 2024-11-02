import axiosInstance from "./axiosInstance";

const getOrders = async () => {
  return axiosInstance.get("/orders");
};

const createOrder = async (orderData: object) => {
  return axiosInstance.post("/orders", orderData);
};

const updateOrder = async (orderId: string, orderData: object) => {
  return axiosInstance.put(`/orders/${orderId}`, orderData);
};

const deleteOrder = async (orderId: string) => {
  return axiosInstance.delete(`/orders/${orderId}`);
};

export default { getOrders, createOrder, updateOrder, deleteOrder };