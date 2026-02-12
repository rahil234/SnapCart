import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Loader2, Wallet } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Coupon } from '@/types';
import { fetchWallet } from '@/store/wallet/walletSlice';
import { CouponService } from '@/services/coupon.service';
import { RootState, useAppDispatch } from '@/store/store';
import PaymentButton from '@/components/user/PaymentButton';
import { CheckoutService } from '@/services/checkout.service';
import AvailableCoupons from '@/components/user/AvailableCoupons';

export interface CheckoutFormValues {
  selectedAddressId: string | null;
  paymentMethod: 'cod' | 'razorpay' | 'wallet';
}

const calculateDiscount = (
  totalAmount: number | undefined,
  discount: number
) => {
  if (!totalAmount) return 0;
  return totalAmount - Math.round((totalAmount * discount) / 100);
};

function CheckoutPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(
    undefined
  );
  const [couponError, setCouponError] = useState<string | undefined>(undefined);
  const [couponsModal, setCouponsModal] = useState(false);

  const navigate = useNavigate();

  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  const { items: addresses } = useSelector((state: RootState) => state.address);

  const { wallet } = useSelector((state: RootState) => state.wallet);

  const { control, handleSubmit, getValues, watch, reset } =
    useForm<CheckoutFormValues>({
      defaultValues: {
        selectedAddressId: null,
        paymentMethod: 'wallet',
      },
    });

  useEffect(() => {
    // Fetch wallet balance on mount
    dispatch(fetchWallet());
  }, [dispatch]);

  useEffect(() => {
    if (addresses && addresses.length > 0) {
      reset({
        selectedAddressId: addresses[0].id,
        paymentMethod: watch('paymentMethod') || 'wallet',
      });
    }
  }, [addresses, reset]);

  const selectedAddressId = watch('selectedAddressId');
  const selectedPaymentMethod = watch('paymentMethod');

  const handleCouponSubmit = async (code: string | null) => {
    setCouponError(undefined);
    if (!code) return;
    const { data, error } = await CouponService.validateCoupon({
      code: code.toUpperCase(),
      cartTotal: totalAmount || 0,
    });

    if (error) {
      return;
    }

    const { data: coupon, error: couponError } =
      await CouponService.getCouponByCode(data.code);

    if (couponError) {
      toast.error('Failed to retrieve coupon details');
      return;
    }

    setAppliedCoupon(coupon);
  };

  const handlePaymentDismissed = () => {
    navigate('/payment-failure', { replace: true });
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsLoading(true);

    if (!data.selectedAddressId) {
      toast.error('Please select a shipping address');
      setIsLoading(false);
      return;
    }

    // Validate wallet balance before checkout if wallet payment
    if (data.paymentMethod === 'wallet') {
      const walletBalance = wallet?.balance ?? 0;
      const finalAmount = appliedCoupon
        ? appliedCoupon.type === 'Percentage'
          ? calculateDiscount(totalAmount, appliedCoupon.discount) +
            (totalAmount > 500 ? 0 : 50)
          : totalAmount - appliedCoupon.discount + (totalAmount > 500 ? 0 : 50)
        : totalAmount + (totalAmount > 500 ? 0 : 50);

      if (walletBalance < finalAmount) {
        toast.error(
          `Insufficient wallet balance. Need ₹${(finalAmount - walletBalance).toFixed(2)} more.`
        );
        setIsLoading(false);
        return;
      }
    }

    const { error } = await CheckoutService.commitCheckout({
      source: 'CART',
      couponCode: appliedCoupon?.code || undefined,
      shippingAddressId: data.selectedAddressId,
      paymentMethod: data.paymentMethod,
    });

    if (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response?.data?.message || 'Checkout failed');
      return;
    }

    if (data.paymentMethod === 'cod') {
      toast.success('Order placed successfully');
      navigate('/order-success', { replace: true });
      setIsLoading(false);
    } else if (data.paymentMethod === 'wallet') {
      // Refresh wallet balance after successful payment
      dispatch(fetchWallet());
      toast.success('Payment successful and order placed');
      navigate('/order-success', { replace: true });
      setIsLoading(false);
    } else if (data.paymentMethod === 'razorpay') {
      // For Razorpay, the loading state will be handled by PaymentButton component
      // Don't set loading to false here as PaymentButton will handle the payment flow
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
              <CardDescription>
                Select or add a shipping address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="selectedAddressId"
                control={control}
                rules={{ required: 'Please select an address' }}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-4"
                  >
                    {addresses.map(address => (
                      <div
                        key={address.id}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem value={address.id} id={address.id} />
                        <Label htmlFor={address.id}>
                          <div>
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state} {address.pincode}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />

              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate('/my-account#addresses')}
              >
                Manage Addresses
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Select your preferred payment method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Controller
                name="paymentMethod"
                control={control}
                rules={{ required: 'Please select a payment method' }}
                render={({ field }) => {
                  // Calculate final amount (considering coupons)
                  const finalAmount = appliedCoupon
                    ? appliedCoupon.type === 'Percentage'
                      ? calculateDiscount(totalAmount, appliedCoupon.discount) +
                        (totalAmount > 500 ? 0 : 50)
                      : totalAmount -
                        appliedCoupon.discount +
                        (totalAmount > 500 ? 0 : 50)
                    : totalAmount + (totalAmount > 500 ? 0 : 50);

                  const walletBalance = wallet?.balance ?? 0;
                  const insufficientBalance = walletBalance < finalAmount;

                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <Label htmlFor="razorpay">Razorpay</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="wallet"
                          id="wallet"
                          disabled={insufficientBalance}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor="wallet"
                              className={
                                insufficientBalance ? 'text-gray-500' : ''
                              }
                            >
                              <Wallet className="inline h-4 w-4 mr-1" />
                              Wallet
                            </Label>
                            <span
                              className={`text-sm ${insufficientBalance ? 'text-red-500' : 'text-green-600'}`}
                            >
                              (Balance: ₹{walletBalance.toFixed(2)})
                            </span>
                          </div>
                          {insufficientBalance && (
                            <p className="text-red-400 text-xs mt-1">
                              Insufficient balance. Need ₹
                              {(finalAmount - walletBalance).toFixed(2)} more.
                              <button
                                type="button"
                                onClick={() => navigate('/my-account#wallet')}
                                className="text-indigo-500 ml-1 hover:underline"
                              >
                                Add funds
                              </button>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="cod"
                          id="cod"
                          disabled={totalAmount > 1000}
                        />
                        <div>
                          <Label
                            htmlFor="cod"
                            className={`${totalAmount > 1000 && 'text-gray-500'}`}
                          >
                            Cash on Delivery
                          </Label>
                          {totalAmount > 1000 && (
                            <p className="text-red-400 text-xs">
                              Not available for orders above 1000
                            </p>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  );
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {items &&
                items.map(item => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={item.variant.imageUrl}
                        alt={item.variant.productName}
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                      <div>
                        <p className="font-semibold">
                          {item.variant.productName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Price: ₹{item.variant.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold">
                      ₹{item.variant.price * item.quantity}
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-5 sticky top-5">
            <CardHeader>
              <CardTitle>Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                onChange={e => setCouponCode(e.target.value.toUpperCase())}
                value={couponCode || undefined}
                placeholder="Enter coupon code"
              />
              <div className="flex justify-end">
                <Dialog open={couponsModal} onOpenChange={setCouponsModal}>
                  <DialogTrigger asChild>
                    <button className="text-green-500 text-xs mt-2">
                      show available coupons
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Available Coupons</DialogTitle>
                      <DialogDescription>
                        this is your available coupons
                      </DialogDescription>
                    </DialogHeader>
                    <AvailableCoupons
                      handleCouponSubmit={handleCouponSubmit}
                      setCouponCode={setCouponCode}
                      onclose={() => setCouponsModal(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleCouponSubmit(couponCode)}
              >
                Apply Coupon
              </Button>
            </CardFooter>
            {appliedCoupon && (
              <CardContent>
                <div className="flex justify-between">
                  <span className="text-green-500">
                    {appliedCoupon.type === 'Percentage'
                      ? `coupon applied: ${appliedCoupon.discount}% off`
                      : `coupon applied: ₹${appliedCoupon.discount} off`}
                  </span>
                </div>
              </CardContent>
            )}
            {couponError && (
              <CardContent>
                <p className="text-red-600">{couponError}</p>
              </CardContent>
            )}
          </Card>
          <Card
            className={`sticky ${appliedCoupon || couponError ? 'top-72' : 'top-64'}`}
          >
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price ({items?.length} items)</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">
                    ₹{totalAmount > 500 ? 'Free' : '50'}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span>Coupon</span>
                    {appliedCoupon.type === 'Percentage' ? (
                      <span>
                        - ₹
                        {Math.round(
                          (totalAmount / 100) * appliedCoupon?.discount
                        )}
                      </span>
                    ) : (
                      <span>- ₹{Math.round(appliedCoupon?.discount)}</span>
                    )}
                  </div>
                )}
                <Separator />
                {appliedCoupon ? (
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    {appliedCoupon.type === 'Percentage' ? (
                      <span>
                        ₹
                        {calculateDiscount(
                          totalAmount,
                          appliedCoupon.discount
                        ) + (totalAmount > 500 ? 0 : 50)}
                      </span>
                    ) : (
                      <span>
                        ₹
                        {totalAmount -
                          appliedCoupon.discount +
                          (totalAmount > 500 ? 0 : 50)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount + (totalAmount > 500 ? 0 : 50)}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {selectedPaymentMethod === 'razorpay' ? (
                <PaymentButton
                  values={{
                    selectedAddressId: selectedAddressId,
                  }}
                  couponCode={appliedCoupon?.code || undefined}
                  disabled={
                    isLoading || !selectedAddressId || !selectedPaymentMethod
                  }
                  handleDismiss={handlePaymentDismissed}
                >
                  Pay with Razorpay
                </PaymentButton>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleSubmit(onSubmit)}
                  disabled={
                    isLoading || !selectedAddressId || !selectedPaymentMethod
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      {selectedPaymentMethod === 'cod' && 'Place Order (COD)'}
                      {selectedPaymentMethod === 'wallet' && 'Pay with Wallet'}
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
