import { useQuery } from '@tanstack/react-query';

import { Order } from '@/types';
import { OrderService } from '@/services/order.service';

export const useGetAdminOrder = (id: string) => {
  return useQuery<Order>({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await OrderService.getOrder(id);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
