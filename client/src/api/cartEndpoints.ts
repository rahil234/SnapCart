import axiosInstance from './axiosInstance';

const getCart = async () => {
  return axiosInstance.get('api/cart');
};

const addToCart = async () => {
  return axiosInstance.post('api/cart');
};

const editCart = async () => {
  return axiosInstance.patch('api/cart');
};

export default { getCart, addToCart, editCart };
