import { AxiosProgressEvent } from 'axios';

import { apiConfig } from '@/api/client';
import {
  CreateProductDto,
  ProductsApi,
  UpdateProductDto,
} from '@/api/generated';
import { handleRequest } from '@/api/utils/handleRequest';

const productApi = new ProductsApi(apiConfig);

export const ProductService = {
  fetchProductById: (productId: string) =>
    handleRequest(() => productApi.productControllerFindOne(productId)),

  fetchProductWithVariantsById: (variantId: string) =>
    handleRequest(() =>
      productApi.productControllerGetProductWithVariants(variantId)
    ),

  getProductsByCategory: (categoryId: string) =>
    handleRequest(() =>
      productApi.productControllerFindAll(
        undefined,
        undefined,
        undefined,
        categoryId
      )
    ),

  addProduct: (data: CreateProductDto) =>
    handleRequest(() => productApi.productControllerCreate(data)),

  editProduct: (productId: string, data: UpdateProductDto) =>
    handleRequest(() => productApi.productControllerUpdate(productId, data)),

  getSellerProducts: () =>
    handleRequest(() => productApi.productControllerFindSellerProducts()),

  getAdminProducts: () =>
    handleRequest(() => productApi.productControllerFindAdminProducts()),

  listProduct: (productId: string) =>
    handleRequest(() => productApi.productControllerActivateProduct(productId)),

  unlistProduct: (productId: string) =>
    handleRequest(() =>
      productApi.productControllerDeactivateProduct(productId)
    ),

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
