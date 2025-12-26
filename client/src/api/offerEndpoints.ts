import { IOffer } from '@snapcart/shared/types';
import axiosInstance from './axiosInstance';

const getOffers = async () => {
  return await axiosInstance.get('/api/offer');
};

const addOffer = async (newOffer: IOffer) => {
  return (await axiosInstance.post('/api/offer', newOffer)).data;
};

const updateOffer = async (id: string, updatedOffer: IOffer) => {
  return (await axiosInstance.put(`/api/offer/${id}`, updatedOffer)).data;
};

const getProductApplicableOffers = async (productId: string) => {
  return (await axiosInstance.get(`/api/offer/product/${productId}`)).data;
};

export default { getOffers, addOffer, updateOffer, getProductApplicableOffers };
