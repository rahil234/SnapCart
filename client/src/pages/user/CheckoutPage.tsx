import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader2, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import PaymentButton from '@/components/user/PaymentButton';
import { Separator } from '@/components/ui/separator';
import { AuthState } from '@/features/auth/authSlice';
import { CartState } from '@/features/cart/cartSlice';
import { clearCart } from '@/features/cart/cartSlice';
import { useAppDispatch } from '@/app/store';
import userEndpoints from '@/api/userEndpoints';
import orderEndpoints from '@/api/orderEndpoints';
import { catchError, ICoupon, Address } from 'shared/types';
import AddressForm from '@/components/user/AddressForm';
import { ImportMeta } from '@types';
import AvailableCoupons from '@/components/user/AvailableCoupons';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/products/';

export interface CheckoutFormValues {
  selectedAddressId: string;
  addresses: Address[];
  paymentMethod: 'cod' | 'razorpay' | 'wallet';
}

const calculateDiscount = (
  totalAmount: number | undefined,
  discount: number,
) => {
  if (!totalAmount) return 0;
  return totalAmount - Math.round((totalAmount * discount) / 100);
};

function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null,
  );
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | undefined>(
    undefined,
  );
  const [couponError, setCouponError] = useState<string | undefined>(undefined);
  const [couponsModal, setCouponsModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state: { auth: AuthState }) => state.auth);
  const { cartData } = useSelector((state: { cart: CartState }) => state.cart);

  const { control, handleSubmit, getValues, watch } =
    useForm<CheckoutFormValues>({
      defaultValues: {
        selectedAddressId: user?.addresses ? '' : '',
        addresses: user?.addresses || [],
        paymentMethod: 'wallet',
      },
    });

  useEffect(() => {
    console.log('applied coupon', appliedCoupon);
  }, [appliedCoupon]);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'addresses',
  });

  const selectedAddressId = watch('selectedAddressId');
  const selectedPaymentMethod = watch('paymentMethod');

  const handleAddAddress = async (address: Address) => {
    try {
      await userEndpoints.addAddress(address);
      append(address);
      setIsAddressDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditAddress = async (index: number, address: Address) => {
    await userEndpoints.editAddress(fields[index]._id!, address);
    update(index, address);
    setEditingAddressIndex(null);
    setIsAddressDialogOpen(false);
  };

  const handleRemoveAddress = async (index: number) => {
    await userEndpoints.deleteAddress(fields[index]._id!);
    remove(index);
    setEditingAddressIndex(null);
    setIsAddressDialogOpen(false);
  };

  const handleCouponSubmit = async (code: string) => {
    try {
      setCouponError(undefined);
      if (!code) return;
      const coupon = (await orderEndpoints.applyCoupon(code)).coupon;
      setAppliedCoupon(coupon);
    } catch (error) {
      setAppliedCoupon(undefined);
      setCouponError((error as catchError).response.data.message);
      toast.error((error as catchError).response.data.message);
    }
  };

  const handlePaymentDismissed = () => {
    navigate('/payment-failure', { replace: true });
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    console.log('data', data);
    try {
      setIsLoading(true);
      console.log('coupon', appliedCoupon);
      const response = await orderEndpoints.createOrder(
        data,
        appliedCoupon?.code || undefined,
      );
      setIsLoading(false);
      dispatch(clearCart());
      navigate('/order-success/' + response.data.orderId, { replace: true });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error((error as catchError).response.data.message);
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
              <form onSubmit={handleSubmit(onSubmit)}>
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
                      {fields.map((address, index) => (
                        <div
                          key={address.id}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem value={address.id} id={address.id} />
                          <Label htmlFor={address.id} className="flex-grow">
                            <div>
                              <p>{address.street}</p>
                              <p>{`${address.city}, ${address.state} ${address.pinCode}`}</p>
                            </div>
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingAddressIndex(index);
                              setIsAddressDialogOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveAddress(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                />
              </form>
              <Dialog
                open={isAddressDialogOpen}
                onOpenChange={setIsAddressDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingAddressIndex !== null
                        ? 'Edit Address'
                        : 'Add New Address'}
                    </DialogTitle>
                  </DialogHeader>
                  <AddressForm
                    onSubmit={
                      editingAddressIndex !== null
                        ? address =>
                          handleEditAddress(editingAddressIndex, address)
                        : handleAddAddress
                    }
                    initialData={
                      editingAddressIndex !== null
                        ? fields[editingAddressIndex]
                        : undefined
                    }
                  />
                </DialogContent>
              </Dialog>
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
                render={({ field }) => (
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
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet">Wallet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="cod"
                        id="cod"
                        disabled={cartData.totalAmount > 1000}
                      />
                      <div>
                        <Label
                          htmlFor="cod"
                          className={`${cartData.totalAmount > 1000 && 'text-gray-500'}`}
                        >
                          Cash on Delivery
                        </Label>
                        {cartData.totalAmount > 1000 && (
                          <p className="text-red-400 text-xs">
                            Not available for orders above 1000
                          </p>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {cartData.items &&
                cartData.items.map(item => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={imageUrl + item.product.images[0]}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-md mr-4"
                      />
                      <div>
                        <p className="font-semibold">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Price: ₹{item.product.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold">
                      ₹{item.product.price * item.quantity}
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
                value={couponCode}
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
                    {appliedCoupon.type === 'percentage'
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
            className={`sticky ${(appliedCoupon || couponError) ? 'top-72' : 'top-64'}`}
          >
            <CardHeader>
              <CardTitle>Price Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price ({cartData.items?.length} items)</span>
                  <span>₹{cartData?.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">
                    ₹{cartData.totalAmount > 500 ? 'Free' : '50'}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span>Coupon</span>
                    {appliedCoupon.type === 'percentage' ? (
                      <span>
                        - ₹
                        {Math.round(
                          (cartData?.totalAmount / 100) *
                          appliedCoupon?.discount,
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
                    {appliedCoupon.type === 'percentage' ? (
                      <span>
                        ₹
                        {calculateDiscount(
                          cartData?.totalAmount,
                          appliedCoupon.discount,
                        ) + (cartData.totalAmount > 500 ? 0 : 50)}
                      </span>
                    ) : (
                      <span>
                        ₹
                        {cartData?.totalAmount -
                          appliedCoupon.discount +
                          (cartData.totalAmount > 500 ? 0 : 50)}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>
                      ₹
                      {cartData?.totalAmount +
                        (cartData.totalAmount > 500 ? 0 : 50)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {selectedPaymentMethod === 'razorpay' ? (
                <PaymentButton
                  getValues={getValues}
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
