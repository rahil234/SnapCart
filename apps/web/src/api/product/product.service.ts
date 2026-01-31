import { AxiosProgressEvent } from 'axios';

import { apiConfig } from '@/api/client';
import { ProductsApi } from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const productApi = new ProductsApi(apiConfig);

export const ProductService = {
  fetchProductById: (productId: string) =>
    handleRequest(() => productApi.productControllerFindOne(productId)),

  getProductByCategory: (category: string) =>
    handleRequest(() => productApi.productControllerFindByCategory(category)),

  getSellerProducts: () =>
    handleRequest(() => productApi.productControllerFindSellerProducts()),

  getAdminProducts: () =>
    handleRequest(() => productApi.productControllerFindAdminProducts()),

  addProduct: (
    data: FormData,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => void
  ) =>
    handleRequest(() =>
      productApi.productControllerCreate(data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
      })
    ),

  editProduct: (data: FormData) =>
    handleRequest(() =>
      productApi.productControllerUpdate(data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ),

  unlistProduct: (productId: string) =>
    handleRequest(() => productApi.productControllerUnlist(productId)),

  listProduct: (productId: string) =>
    handleRequest(() => productApi.productControllerList(productId)),

  getRelatedProduct: (productId: string) =>
    handleRequest(() => productApi.productControllerFindRelated(productId)),

  getAllProducts: () =>
    handleRequest(() => productApi.productControllerFindAll()),

  searchProducts: (params: {
    query: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    page?: number;
    limit?: number;
  }) => handleRequest(() => productApi.productControllerSearch(params)),

  getTopProducts: () =>
    handleRequest(() => productApi.productControllerFindTop()),
};
