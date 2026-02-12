import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CategoryService } from '@/services/category.service';

export const useUnarchiveCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CategoryService.unarchiveCategory(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};
