import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { catchError } from '@/types/error';
import { Button } from '@/components/ui/button';
import { UseFormGetValues } from 'react-hook-form';
import { OrderService } from '@/api/order/order.service';
import { CheckoutFormValues } from '@/pages/user/CheckoutPage';
import { RazorpayOptions, RazorpayResponse } from '@/types/razorpay';

interface PaymentButtonProps {
  getValues: UseFormGetValues<CheckoutFormValues>;
  children: React.ReactNode;
  couponCode: string | undefined;
  disabled: boolean;
  handleDismiss?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  couponCode,
  children,
  getValues,
  disabled,
  handleDismiss,
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
      const orderData = getValues();
      await OrderService.verifyCheckout();
      const ord = await OrderService.createOrder(
        orderData,
        couponCode || undefined
      );
      const order = (await OrderService.createPayment(ord.data.orderId)).data;

      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your connection.');
        return;
      }

      const options: RazorpayOptions = {
        key: (import.meta as unknown as ImportMeta).env.VITE_RAZORPAY_KEY_ID,
        order_id: order.id,
        description: 'Product Purchase',
        handler: response => {
          console.log(response);
          verifyPayment({ ...response, orderId: ord.data.orderId });
        },
        modal: {
          ondismiss: handleDismiss
            ? handleDismiss
            : () => {
                console.log('Payment cancelled');
              },
        },
        prefill: {
          name: 'Rahil',
          email: 'rahil@example.com',
          contact: '8136900460',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', response => {
        console.log('failed', response);
        toast.error('Payment failed');
        navigate('/order-failure', { replace: true });
      });
      rzp.open();
    } catch (error) {
      toast.error((error as catchError).response.data.message);
    }
  };

  const verifyPayment = async (data: RazorpayResponse) => {
    try {
      const orderId = (await OrderService.verifyPayment(data)).orderId;

      navigate('/order-success/' + orderId, { replace: true });
    } catch (error) {
      toast.error((error as catchError).response.data.message);
    }
  };

  return (
    <Button className="w-full" onClick={handlePayment} disabled={disabled}>
      {children}
    </Button>
  );
};

export default PaymentButton;
