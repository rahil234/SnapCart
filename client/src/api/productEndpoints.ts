import axiosInstance from './axiosInstance';


const getLatestProducts = () => {
  return axiosInstance.get('/api/product');
};

const fetchProductById = (productId: string) => {
  return axiosInstance.get(`/api/product/${productId}`);
};

const getProductByCategory = (category: string) => {
  return axiosInstance.get('/api/product/category/' + category);
};

const getSellerProducts = () => {
  return axiosInstance.get('/api/product/seller');
};

const getAdminProducts = () => {
  return axiosInstance.get('/api/product/admin');
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
  getLatestProducts,
  fetchProductById,
  getSellerProducts,
  getAdminProducts,
  getProductByCategory,
  addProduct,
  editProduct,
  getRelatedProduct,
  unlistProduct,
  listProduct,
};
