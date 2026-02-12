import { useQuery } from '@tanstack/react-query';

import { ProductService } from '@/services/product.service';

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await ProductService.fetchProductById(productId);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    enabled: !!productId,
  });
};
