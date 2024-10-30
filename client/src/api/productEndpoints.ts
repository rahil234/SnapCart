import axiosInstance from './axiosInstance';

const getSellerProducts = () => {
  return axiosInstance.get('/api/product/get-seller-products');
};

const getAdminProducts = () => {
  return axiosInstance.get('/api/product/get-admin-products');
};

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

const getRelatedProduct = (productId: string) => {
  return axiosInstance.get('/api/product/related-products/' + productId);
};

export default {
  getSellerProducts,
  getAdminProducts,
  addProduct,
  editProduct,
  getRelatedProduct,
  unlistProduct,
  listProduct,
};
