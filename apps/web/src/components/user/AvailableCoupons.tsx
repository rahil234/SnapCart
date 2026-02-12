import React from 'react';

import { Coupon } from '@/types';
import { Button } from '@/components/ui/button';
import { useGetAvailableCoupons } from '@/hooks/coupons/use-get-coupons.hook';

const AvailableCoupons = ({
  handleCouponSubmit,
  setCouponCode,
  onclose,
}: {
  handleCouponSubmit: (code: string) => void;
  setCouponCode: (code: string) => React.SetStateAction<void>;
  onclose: () => void;
}) => {
  const { data: coupons, isLoading, isError } = useGetAvailableCoupons();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !coupons) {
    return <div>Error fetching coupons</div>;
  }

  if (coupons.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-warning">No coupons available</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto py-2">
      {coupons.length ? (
        <ul className="divide-y divide-gray-200">
          {coupons.map((coupon: Coupon) => (
            <li key={coupon.id} className="py-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">{coupon.code}</h3>
                  <p>
                    {coupon.type === 'Flat'
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
