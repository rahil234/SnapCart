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

const unlistProduct = (productId: string) => {
  return axiosInstance.patch('/api/product/unlist-product/' + productId);
};

const listProduct = (productId: string) => {
  return axiosInstance.patch('/api/product/list-product/' + productId);
};

const getRelatedProduct = (subcategoryId: string) => {
  return axiosInstance.get('/api/product/related-products/' + subcategoryId);
};

export default {
  addProduct,
  editProduct,
  getRelatedProduct,
  unlistProduct,
  listProduct,
};
