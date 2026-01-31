import React from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { ICoupon } from '@/types/coupon';
import { CouponService } from '@/api/coupon/coupon.service';

const AvailableCoupons = ({
  handleCouponSubmit,
  setCouponCode,
  onclose,
}: {
  handleCouponSubmit: (code: string) => void;
  setCouponCode: (code: string) => React.SetStateAction<void>;
  onclose: () => void;
}) => {
  const {
    data: coupons,
    isLoading,
    isError,
  } = useQuery<ICoupon[]>({
    queryKey: ['available-coupons'],
    queryFn: CouponService.getAvailableCoupons,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching coupons</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto py-2">
      {coupons.length ? (
        <ul className="divide-y divide-gray-200">
          {coupons.map((coupon: ICoupon) => (
            <li key={coupon._id} className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{coupon.code}</h3>
                  <p>
                    {coupon.type === 'fixed'
                      ? `₹${coupon.discount} off on min purchase of ${coupon.minAmount}`
                      : `${coupon.discount}% off on min purchase of ${coupon.minAmount}`}
                  </p>
                </div>
                <Button
                  className="text-xs"
                  onClick={() => {
                    setCouponCode(coupon.code);
                    handleCouponSubmit(coupon.code);
                    onclose();
                  }}
                >
                  Apply
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center gap-2">
          <p className="text-sm text-warning">No coupons available</p>
        </div>
      )}
    </div>
  );
};

export default AvailableCoupons;
