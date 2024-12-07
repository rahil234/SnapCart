import axiosInstance from './axiosInstance';
import { ICoupon } from 'shared/types';

const getCoupons = async () => {
  return (await axiosInstance.get('/api/coupon')).data;
};

const addCoupon = async (coupon: ICoupon) => {
  return (await axiosInstance.post('/api/coupon', coupon)).data;
};

const updateCoupon = async (coupon: ICoupon) => {
  return (await axiosInstance.put(`/api/coupon/${coupon._id}`, coupon)).data;
};

const getAvailableCoupons = async () => {
  return (await axiosInstance.get('/api/coupon/available')).data;
};

export default { getCoupons, addCoupon, updateCoupon, getAvailableCoupons };
