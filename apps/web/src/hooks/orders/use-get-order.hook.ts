import { useQuery } from '@tanstack/react-query';

import { Order } from '@/types';
import { OrderService } from '@/services/order.service';

export const useGetOrderById = (id: string, options: { enabled: boolean }) => {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await OrderService.getOrderDetails(id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    enabled: options.enabled,
  });
};
