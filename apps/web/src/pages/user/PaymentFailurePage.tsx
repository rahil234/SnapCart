import React from 'react';
import { Link } from 'react-router';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function PaymentFailurePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            Order Payment Failed!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            Retry your payment or contact support if you are facing issues.
          </p>
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

export default PaymentFailurePage;
