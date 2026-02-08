import {
  CreateProductDto,
  ProductsAdminApi,
  ProductsApi,
  ProductsPublicApi,
  ProductsSellerApi,
  UpdateProductDto,
} from '@/api/generated';
import { apiClient } from '@/api/axios';
import { apiConfig } from '@/api/client';
import { handleRequest } from '@/api/utils/handleRequest';

const productApi = new ProductsApi(apiConfig, undefined, apiClient);
const productPublicApi = new ProductsPublicApi(apiConfig, undefined, apiClient);

const productsSellerApi = new ProductsSellerApi(
  apiConfig,
  undefined,
  apiClient
);
const productsAdminApi = new ProductsAdminApi(apiConfig, undefined, apiClient);

export const ProductService = {
  fetchProductById: (productId: string) =>
    handleRequest(() =>
      productPublicApi.productPublicControllerFindOne(productId)
    ),

  fetchProductWithVariantsById: (variantId: string) =>
    handleRequest(() =>
      productApi.productControllerGetProductWithVariants(variantId)
    ),

  getProductsByCategory: (categoryId: string) =>
    handleRequest(() =>
      productPublicApi.productPublicControllerFindAll(
        undefined,
        undefined,
        undefined,
        categoryId
      )
    ),

  createProduct: (data: CreateProductDto) =>
    handleRequest(() => productsSellerApi.sellerProductControllerCreate(data)),

  updateProduct: (productId: string, data: UpdateProductDto) =>
    handleRequest(() => productApi.productControllerUpdate(productId, data)),

  getSellerProducts: () =>
    handleRequest(() =>
      productsSellerApi.sellerProductControllerGetSellerProducts()
    ),

  getAdminProducts: () =>
    handleRequest(() =>
      productsAdminApi.adminProductControllerGetAdminProducts()
    ),

  listProduct: (productId: string) =>
    handleRequest(() =>
      productsSellerApi.sellerProductControllerActivateProduct(productId)
    ),

  unlistProduct: (productId: string) =>
    handleRequest(() =>
      productsSellerApi.sellerProductControllerDeactivateProduct(productId)
    ),

  getRelatedProduct: (productId: string) =>
    handleRequest(() => productApi.productControllerActivateProduct(productId)),

  getAllProducts: () =>
    handleRequest(() => productApi.productControllerFindAll()),

  searchProducts: (params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name' | 'price' | 'createdAt' | undefined;
    page?: number;
    limit?: number;
  }) =>
    handleRequest(() =>
      productPublicApi.productPublicControllerFindAll(
        params.page,
        params.limit,
        params.query,
        params.category,
        undefined,
        params.sortBy
      )
    ),

  getTopProducts: () =>
    handleRequest(() => productApi.productControllerFindTop()),
};
