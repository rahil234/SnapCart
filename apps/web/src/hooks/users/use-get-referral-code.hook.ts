import { useQuery } from '@tanstack/react-query';

export const useGetReferralCode = () => {
  return useQuery({
    queryKey: ['referral-code'],
    queryFn: async () => {
      return 'REFERRAL-CODE-123';
    },
  });
};
