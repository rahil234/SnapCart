import { useQuery } from '@tanstack/react-query';

import { ProductService } from '@/services/product.service';

export const useGetSellerProducts = () => {
  return useQuery({
    queryKey: ['seller-products'],
    queryFn: async () => {
      const { data, error } = await ProductService.getSellerProducts();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
