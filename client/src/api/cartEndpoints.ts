import axiosInstance from './axiosInstance';
const getCart = async () => {
  return axiosInstance.get('api/cart');
};

const addToCart = async (productId: string) => {
  return axiosInstance.post('/api/cart', { productId });
};

const updateCart = async (productId: string, quantity: number) => {
  return axiosInstance.patch(`/api/cart/${productId}`, { quantity });
};

const removeItem = async (productId: string) => {
  return axiosInstance.delete(`/api/cart/${productId}`);
};

export default { getCart, addToCart, updateCart, removeItem };
