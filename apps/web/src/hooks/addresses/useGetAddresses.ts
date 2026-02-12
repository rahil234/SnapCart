import { useQuery } from '@tanstack/react-query';
import { AddressService } from '@/services/address.service';

export const useGetAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const { data, error } = await AddressService.fetchMyAddresses();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};
