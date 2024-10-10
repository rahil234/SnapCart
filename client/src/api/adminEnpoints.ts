import axiosInstance from './axiosInstance';

export const adminLogin = (data: object) => {
  return axiosInstance.post('/api/admin/login', data);
};

export const getCategories = () => {
  return axiosInstance.get('/api/admin/get-categories');
};

export const editCatogories = (data: object) => {
  return axiosInstance.patch('/api/admin/edit-categories', data);
};

export const addProduct = (data: object) => {
  axiosInstance.post('/api/admin/add-product', data);
};
