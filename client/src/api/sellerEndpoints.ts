import axiosInstance from './axiosInstance';

const login = async (data: { email: string; password: string }) => {
  return axiosInstance.post('/api/seller/login', data, {
    withCredentials: true,
  });
};

const addSeller = async (data: {
  firstName: string;
  email: string;
  password: string;
}) => {
  return await axiosInstance.post(`/api/seller/add-sellers`, data);
};

const blockSeller = async (sellerId: string) => {
  return await axiosInstance.patch(`/api/seller/${sellerId}/block`);
};

const allowSeller = async (sellerId: string) => {
  return await axiosInstance.patch(`/api/seller/${sellerId}/allow`);
};



export default { login, addSeller, blockSeller, allowSeller };
