import { useQuery } from '@tanstack/react-query';

import { Category } from '@/types';
import { CategoryService } from '@/services/category.service';

export const useGetCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await CategoryService.getCategories();
      if (error) throw error;
      return data;
    },
  });
};
