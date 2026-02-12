import { useQuery } from '@tanstack/react-query';

import { ProductService } from '@/services/product.service';

export const useGetProductsByCategoryId = (
  categoryId: string,
  { enabled }: { enabled: boolean } = { enabled: true }
) => {
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
    enabled: enabled && !!categoryId,
    initialData: () => [],
  });
};
