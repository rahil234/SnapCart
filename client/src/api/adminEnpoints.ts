import axiosInstance from './axiosInstance';

export const adminLogin = (data: object) => {
  return axiosInstance.post('/api/admin/login', data);
};
