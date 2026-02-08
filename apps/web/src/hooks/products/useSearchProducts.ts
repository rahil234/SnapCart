import { useQuery } from '@tanstack/react-query';

import { ProductService } from '@/services/product.service';

export interface ProductSearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
}

export const useSearchProducts = (params: ProductSearchParams) => {
  const {
    query,
    category,
    minPrice = 0,
    maxPrice = 1000,
    sortBy = 'name',
  } = params;

  return useQuery({
    queryKey: [
      'products',
      'search',
      query,
      category,
      minPrice,
      maxPrice,
      sortBy,
    ],
    queryFn: async () => {
      const { data, error } = await ProductService.searchProducts({
        query,
        category,
        minPrice,
        maxPrice,
        sortBy,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
