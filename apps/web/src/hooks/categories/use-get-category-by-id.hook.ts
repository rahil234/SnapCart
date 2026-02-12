import { useQuery } from '@tanstack/react-query';

import { Category } from '@/types';
import { CategoryService } from '@/services/category.service';

export const useGetCategoriesById = (categoryId: string) => {
  return useQuery<Category>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } =
        await CategoryService.getCategoriesById(categoryId);

      if (error) throw error;

      return data;
    },
  });
};
