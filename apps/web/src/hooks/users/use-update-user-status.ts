import { useMutation, useQueryClient } from '@tanstack/react-query';

import { User } from '@/types';
import { UserService } from '@/services/user.service';

type UpdateUserStatusPayload = {
  id: string;
  status: User['status'];
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdateUserStatusPayload) =>
      UserService.updateStatus(id, { status }),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
