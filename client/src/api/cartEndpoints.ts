import axiosInstance from './axiosInstance';
import { ICart } from 'shared/types';
const getCart = async () => {
  return axiosInstance.get('api/cart');
};

const addToCart = async (productId: string) => {
  return axiosInstance.post('/api/cart', { productId });
};

const updateCart = async (cartData: ICart) => {
  return axiosInstance.patch('/api/cart', { cartData });
};

const removeItem = async (productId: string) => {
  return axiosInstance.delete(`/api/cart/${productId}`);
};

export default { getCart, addToCart, updateCart, removeItem };
