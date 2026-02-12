import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowRight, CheckCircle, ShoppingBag } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetOrderById } from '@/hooks/orders/use-get-order.hook';

function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) {
      navigate('/');
    }
  }, [navigate]);

  const {
    data: order,
    error,
    isLoading,
  } = useGetOrderById(orderId!, {
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md animate-pulse">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-gray-300" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center text-gray-300">
              Loading Order...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-300 mb-4">
              Please wait while we fetch your order details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-semibold text-center">
              Order Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600 mb-4">
              We couldn&#39;t find the order details. Please try again later.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/">Go Back to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            Order Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
          <div className="bg-gray-50 flex gap-2 items-center p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Order Id:</p>
            <p className="text-lg font-semibold">#{order.orderNumber}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link to="/my-account#orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default OrderSuccessPage;
