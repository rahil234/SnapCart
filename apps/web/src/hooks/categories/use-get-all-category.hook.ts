import { useQuery } from '@tanstack/react-query';

import { CategoryService } from '@/services/category.service';

export const useGetAllCategories = () => {
  return useQuery({
    queryKey: ['all-categories'],
    queryFn: CategoryService.getCategories,
  });
};
