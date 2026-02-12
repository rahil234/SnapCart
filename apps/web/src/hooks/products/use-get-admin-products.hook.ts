import { useQuery } from '@tanstack/react-query';

import { ProductService } from '@/services/product.service';

export const useGetAdminProducts = () => {
  return useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await ProductService.getAdminProducts();
      if (error) throw error;
      return data;
    },
  });
};
