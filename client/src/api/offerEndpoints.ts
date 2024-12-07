import { IOffer } from 'shared/types';
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



export default { getOffers, addOffer, updateOffer };
