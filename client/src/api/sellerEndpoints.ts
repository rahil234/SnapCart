import axiosInstance from './axiosInstance';

const login = async (data: { email: string; password: string }) => {
  return axiosInstance.post('/api/seller/login', data);
};

const addSeller = async (data: {
  firstName: string;
  email: string;
  password: string;
}) => {
  return await axiosInstance.post(`/api/seller/add-sellers`, data);
};

const blockSeller = async (userId: string) => {
  return await axiosInstance.patch(`/api/seller/${userId}/block`);
};

const allowSeller = async (userId: string) => {
  return await axiosInstance.patch(`/api/seller/${userId}/allow`);
};

export default { login, addSeller, blockSeller, allowSeller };
