import React, { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import orderEndpoints from '@/api/orderEndpoints'

function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        await orderEndpoints.getOrder(orderId!);
      } catch (error) {
        navigate('/');
        console.log(error);
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">Order Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          <div className="bg-gray-50 flex gap-2 items-center p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">Order ID:</p>
            <p className="text-lg font-semibold">{orderId}</p>
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
  )
}

export default OrderSuccessPage