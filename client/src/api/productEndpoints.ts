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

const getSellerProducts = async () => {
  return (await axiosInstance.get('/api/product/seller')).data;
};

const getAdminProducts = async () => {
  return (await axiosInstance.get('/api/product/admin')).data;
};

const addProduct = (data: FormData) => {
  return axiosInstance.post('/api/product/add-product', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const editProduct = async (data: FormData) => {
  return (
    await axiosInstance.patch('/api/product/edit-product', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  ).data;
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

const searchProducts = async ({
  query,
  category,
  minPrice,
  maxPrice,
  sortBy,
  page = 1,
  limit = 100,
}: {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}) => {
  console.log(
    'searchProducts',
    query,
    category,
    minPrice,
    maxPrice,
    sortBy,
    page,
    limit
  );

  const params = new URLSearchParams();
  params.append('query', query);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  if (category && category !== 'all') {
    params.append('category', category);
  }

  if (minPrice) {
    params.append('minPrice', minPrice.toString());
  }
  if (maxPrice) {
    params.append('maxPrice', maxPrice.toString());
  }

  if (sortBy) {
    params.append('sortBy', sortBy);
  }

  const response = await axiosInstance.get(
    `/api/product/search?${params.toString()}`
  );
  return response.data;
};

const getTopProducts = async () => {
  return (await axiosInstance.get('/api/product/topProduct')).data;
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
  searchProducts,
  getTopProducts,
};
