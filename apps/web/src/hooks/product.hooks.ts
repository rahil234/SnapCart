import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { ProductService } from '@/services/product.service';
import { FeedService } from '@/services/feed.service';

export const useGetUserFeed = () => {
  return useSuspenseQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const { data, error } = await FeedService.getHomeFeed();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ['all-products'],
    queryFn: ProductService.getAllProducts,
  });
};

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => ProductService.fetchProductById(productId),
    enabled: !!productId,
  });
};

export const useGetProductsByCategoryId = (categoryId: string) => {
  return useQuery({
    queryKey: ['product', categoryId],
    queryFn: async () => {
      const { data, error } =
        await ProductService.getProductsByCategory(categoryId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!categoryId,
  });
};

export const useGetSellerProducts = () => {
  return useQuery({
    queryKey: ['seller-products'],
    queryFn: ProductService.getSellerProducts,
  });
};

export const useGetAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: ProductService.getAdminProducts,
  });
};
