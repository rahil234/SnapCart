import React from 'react';
import { Link, useParams } from 'react-router';
import { ArrowRight, XCircle, ShoppingBag, RefreshCw } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RetryPaymentButton from '@/components/user/RetryPaymentButton';

function PaymentFailurePage() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center text-red-600">
            Payment Failed!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            Your payment could not be processed. You can retry the payment or continue shopping.
          </p>
          {orderId && (
            <p className="text-center text-sm text-gray-500">
              Order ID: {orderId}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {orderId && (
            <RetryPaymentButton orderId={orderId} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Payment
            </RetryPaymentButton>
          )}
          <Button asChild className="w-full" variant="outline">
            <Link to="/my-account#orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
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

export default PaymentFailurePage;
