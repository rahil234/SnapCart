import axiosInstance from './axiosInstance';

const getCart = async () => {
  return axiosInstance.get('api/cart');
};

const addToCart = async (productId: string) => {
  return axiosInstance.post('/api/user/shopping-cart', { productId });
};

const editCart = async (productId: string, quantity: number) => {
  return axiosInstance.patch('/api/user/shopping-cart', {
    productId,
    quantity,
  });
};

export default { getCart, addToCart, editCart };
