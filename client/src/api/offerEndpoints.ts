import { Offer } from 'shared/types';
import axiosInstance from './axiosInstance';

const getOffers = async () => {
  return await axiosInstance.get('/api/offer');
};

const addOffer = async (newOffer: Offer) => {
  return (await axiosInstance.post('/api/offer', newOffer)).data;
};

const updateOffer = async (id: string, updatedOffer: Offer) => {
  return (await axiosInstance.put(`/api/offer/${id}`, updatedOffer)).data;
};



export default { getOffers, addOffer, updateOffer };
