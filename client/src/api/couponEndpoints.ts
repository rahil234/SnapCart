import axiosInstance from './axiosInstance';
import { ICoupon } from 'shared/types';

const getCoupons = async () => {
    return (await axiosInstance.get('/api/coupon')).data
}

const addCoupon = async (coupon: Omit<ICoupon, 'id'>) => {
    return (await axiosInstance.post('/api/coupon', coupon)).data
}

const updateCoupon = async (coupon: ICoupon) => {
    console.log('Updating coupon:', coupon)
    return (await axiosInstance.put(`/api/coupon/${coupon._id}`, coupon)).data
}

export default { getCoupons, addCoupon, updateCoupon };