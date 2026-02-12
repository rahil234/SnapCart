import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { catchError } from '@/types/error';
import { Button } from '@/components/ui/button';
import { RazorpayOptions } from '@/types/razorpay';
import { OrderService } from '@/services/order.service';
import { CheckoutService } from '@/services/checkout.service';
import { CartService } from '@/services/cart.service';

interface PaymentButtonProps {
  values: {
    selectedAddressId: string | null;
  };
  children: React.ReactNode;
  couponCode: string | undefined;
  disabled: boolean;
  handleDismiss?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  couponCode,
  children,
  disabled,
  handleDismiss,
  values,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      if (!values.selectedAddressId) {
        toast.error('Please select a shipping address');
        return;
      }

      // First commit the checkout to create the order
      const { data, error } = await CheckoutService.commitCheckout({
        source: 'CART',
        couponCode: couponCode || undefined,
        shippingAddressId: values.selectedAddressId,
        paymentMethod: 'razorpay',
      });

      if (error) {
        toast.error(error.response?.data?.message || 'Checkout failed');
        return;
      }

      const orderId = data.id;

      // Create Razorpay payment order
      const paymentResult = await OrderService.createPayment({ orderId });

      if (paymentResult.error) {
        toast.error('Failed to create payment order');
        return;
      }

      const razorpayOrder = paymentResult.data;

      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your connection.');
        return;
      }

      const options: RazorpayOptions = {
        key: (import.meta as unknown as ImportMeta).env.VITE_RAZORPAY_KEY_ID,
        order_id: razorpayOrder.id,
        description: 'Product Purchase',
        handler: response => {
          console.log(response);
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          });
        },
        modal: {
          ondismiss: handleDismiss
            ? handleDismiss
            : () => {
                console.log('Payment cancelled');
              },
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', response => {
        console.log('failed', response);
        toast.error('Payment failed');
        navigate('/payment-failure/' + orderId, { replace: true });
      });
      rzp.open();
    } catch (error) {
      toast.error(
        (error as catchError).response?.data?.message ||
          'Payment initiation failed'
      );
    }
  };

  const verifyPayment = async (data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    orderId: string;
  }) => {
    try {
      const result = await OrderService.verifyPayment(data);

      if (result.error) {
        toast.error('Payment verification failed');
        navigate('/payment-failure/' + data.orderId, { replace: true });
        return;
      }

      // Clear cart after successful payment
      try {
        await CartService.clearCart();
      } catch (cartError) {
        console.warn('Failed to clear cart after successful payment:', cartError);
        // Don't fail the payment flow if cart clearing fails
      }

      toast.success('Payment successful!');
      navigate('/order-success/' + data.orderId, { replace: true });
    } catch (error) {
      toast.error(
        (error as catchError).response?.data?.message ||
          'Payment verification failed'
      );
      navigate('/payment-failure/' + data.orderId, { replace: true });
    }
  };

  return (
    <Button className="w-full" onClick={handlePayment} disabled={disabled}>
      {children}
    </Button>
  );
};

export default PaymentButton;
