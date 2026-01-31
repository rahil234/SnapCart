import { apiClient } from './axios';
import { IOffer } from '@/types/offer';
import axios from 'axios';

const getOffers = async () => {
  return await apiClient.get('/api/offer');
};

const addOffer = async (newOffer: IOffer) => {
  return (await axios.post('/api/offer', newOffer)).data;
};

const updateOffer = async (id: string, updatedOffer: IOffer) => {
  return (await axios.put(`/api/offer/${id}`, updatedOffer)).data;
};

const getProductApplicableOffers = async (productId: string) => {
  return (await axios.get(`/api/offer/product/${productId}`)).data;
};

export default { getOffers, addOffer, updateOffer, getProductApplicableOffers };
