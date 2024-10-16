import axiosInstance from './axiosInstance';

export const adminLogin = (data: object) => {
  return axiosInstance.post('/api/admin/login', data);
};

export const getCategories = () => {
  return axiosInstance.get('/api/admin/get-categories');
};

export const addCategory = (data: object) => {
  return axiosInstance.post('/api/admin/add-category', data);
};

export const editCatogories = (data: object) => {
  return axiosInstance.patch('/api/admin/edit-categories', data);
};

export const getProducts = () => {
  return axiosInstance.get('/api/admin/get-products');
};

export const addProduct = (data: FormData) => {
  return axiosInstance.post('/api/admin/add-product', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
};

export const getUsers = () => {
  return axiosInstance.get('/api/admin/get-users');
};