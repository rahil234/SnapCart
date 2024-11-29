import React, { useEffect, useRef, useState } from 'react';
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
import { catchError, ICoupon } from 'shared/types';
import { ImportMeta } from '@types';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/products/';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface CheckoutFormValues {
  selectedAddressId: string;
  addresses: Address[];
  paymentMethod: 'cod' | 'razorpay' | 'wallet';
}

const calculateDiscount = (
  totalAmount: number | undefined,
  discount: number
) => {
  if (!totalAmount) return 0;
  return totalAmount - Math.round((totalAmount * discount) / 100);
};

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState<number | null>(
    null
  );
  const couponInput = useRef<HTMLInputElement>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<ICoupon | undefined>(
    undefined
  );

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

  const handleEditAddress = (index: number, address: Address) => {
    update(index, address);
    setEditingAddressIndex(null);
    setIsAddressDialogOpen(false);
  };

  const handleCouponSubmit = async () => {
    try {
      const couponCode = couponInput.current?.value;
      if (!couponCode) return;
      const coupon = (await orderEndpoints.applyCoupon(couponCode)).coupon;
      console.log(coupon);
      setAppliedCoupon(coupon);
    } catch (error) {
      console.log(error);
      setAppliedCoupon(undefined);
      toast.error((error as catchError).response.data.message);
    }
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    // console.log('submitCoupon',appliedCoupon);
    console.log('data', data);
    try {
      setIsLoading(true);
      console.log('coupon', appliedCoupon);
      const response = await orderEndpoints.createOrder(
        data,
        appliedCoupon?.code || undefined
      );
      setIsLoading(false);
      dispatch(clearCart());
      // navigate('/order-success/' + response.data.orderId, { replace: true });
      navigate('/order-success/' + response.data.orderId);
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
                              <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
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
                            onClick={() => remove(index)}
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
          <Card className="mb-5">
            <CardHeader>
              <CardTitle>Coupon</CardTitle>
            </CardHeader>
            <CardContent>
              <Input ref={couponInput} placeholder="Enter coupon code" />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleCouponSubmit}>
                Apply Coupon
              </Button>
            </CardFooter>
          </Card>
          <Card>
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
                            appliedCoupon?.discount
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
                          appliedCoupon.discount
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

interface AddressFormProps {
  onSubmit: (address: Address) => void;
  initialData?: Address;
}

function AddressForm({ onSubmit, initialData }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="street">Street</Label>
        <Input
          id="street"
          {...register('street', { required: 'Street is required' })}
          className="mt-1"
        />
        {errors.street && (
          <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          {...register('city', { required: 'City is required' })}
          className="mt-1"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          {...register('state', { required: 'State is required' })}
          className="mt-1"
        />
        {errors.state && (
          <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="zipCode">Zip Code</Label>
        <Input
          id="zipCode"
          {...register('zipCode', { required: 'Zip Code is required' })}
          className="mt-1"
        />
        {errors.zipCode && (
          <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full">
        {initialData ? 'Update Address' : 'Add Address'}
      </Button>
    </form>
  );
}
