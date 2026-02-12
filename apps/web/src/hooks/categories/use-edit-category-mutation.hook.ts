import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Category } from '@/types';
import { CategoryService } from '@/services/category.service';

export const useEditCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Category }) =>
      CategoryService.updateCategory(id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};
