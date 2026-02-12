import { useQuery } from '@tanstack/react-query';

import { CategoryService } from '@/services/category.service';

export const useGetTopCategories = () => {
  return useQuery({
    queryKey: ['top-categories'],
    queryFn: CategoryService.getTopCategories,
  });
};
