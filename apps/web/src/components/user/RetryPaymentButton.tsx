import { toast } from 'sonner';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { RazorpayOptions } from '@/types/razorpay';
import { OrderService } from '@/services/order.service';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

interface PaymentButtonProps {
  orderId: string;
  className?: string;
  children: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  className,
  children,
  orderId,
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
      const { data: order, error } = await OrderService.createPayment({
        orderId,
      });

      if (error) {
        toast.error('Failed to create payment order');
        return;
      }

      if (!window.Razorpay) {
        alert('Razorpay SDK failed to load. Please check your connection.');
        return;
      }

      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        order_id: order.id,
        description: 'Product Purchase',
        handler: response => {
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          });
        },
        modal: {
          ondismiss: () => {},
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
      console.error('Payment initiation error:', error);
      toast.error('Failed to initiate payment');
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
        navigate('/payment-failure', { replace: true });
        return;
      }

      toast.success('Payment successful!');
      navigate('/order-success/' + data.orderId, { replace: true });
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Payment verification failed');
      navigate('/payment-failure', { replace: true });
    }
  };

  return (
    <Button className={className} onClick={handlePayment}>
      {children}
    </Button>
  );
};

export default PaymentButton;
