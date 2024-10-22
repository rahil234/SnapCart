import axiosInstance from './axiosInstance';

const addProduct = (data: FormData) => {
  return axiosInstance.post('/api/product/add-product', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const editProduct = (data: FormData) => {
  return axiosInstance.patch('/api/product/edit-product', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export default { addProduct, editProduct };
