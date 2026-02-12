import { useQuery } from '@tanstack/react-query';

import { Order } from '@/types';
import { OrderService } from '@/services/order.service';

export const useGetSellerOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await OrderService.getSellerOrders();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
