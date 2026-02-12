import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Order } from '@/types';
import { OrderService } from '@/services/order.service';

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<Order, 'orderStatus' | 'id'>) =>
      OrderService.updateOrderStatus(data.id, {
        status: data.orderStatus,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
};
