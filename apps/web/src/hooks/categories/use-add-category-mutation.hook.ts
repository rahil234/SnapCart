import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types';
import { CategoryService } from '@/services/category.service';

export const useAddCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<Category, 'name'>) =>
      CategoryService.createCategory(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
      await queryClient.invalidateQueries({ queryKey: ['all-categories'] });
    },
  });
};
