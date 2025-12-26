import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import couponEndpoints from '@/api/couponEndpoints';
import { ICoupon } from '@snapcart/shared/types';

function AvailableCoupons({
  handleCouponSubmit,
                            setCouponCode,
  onclose,
}: {
  handleCouponSubmit: (code: string) => void;
  setCouponCode: (code: string) => React.SetStateAction<void>;
  onclose: () => void;
}) {
  const {
    data: coupons,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['coupons'],
    queryFn: couponEndpoints.getAvailableCoupons,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error fetching coupons</p>;
  }

  return (
    <Card className="w-full max-w-md mx-auto py-2">
      <CardContent>
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
            <AlertCircle className="text-warning" />
            <p className="text-sm text-warning">No coupons available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AvailableCoupons;
