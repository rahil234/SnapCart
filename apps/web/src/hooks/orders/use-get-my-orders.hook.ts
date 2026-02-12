import { useQuery } from '@tanstack/react-query';

import { Order } from '@/types';
import { OrderService } from '@/services/order.service';

export const useGetMyOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await OrderService.getMyOrders();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
