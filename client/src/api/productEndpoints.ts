import axiosInstance from './axiosInstance';

const getProducts = () => {
  return axiosInstance.get('/api/product/get-products');
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
  getProducts,
  addProduct,
  editProduct,
  getRelatedProduct,
  unlistProduct,
  listProduct,
};
