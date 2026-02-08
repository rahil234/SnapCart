import { useQuery } from '@tanstack/react-query';
import { UserService } from '@/services/user.service';

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await UserService.getUsers();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
