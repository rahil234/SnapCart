import { useQuery } from '@tanstack/react-query';

import { Order } from '@/types';
import { OrderService } from '@/services/order.service';

export const useGetAdminOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await OrderService.getAdminOrders();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
