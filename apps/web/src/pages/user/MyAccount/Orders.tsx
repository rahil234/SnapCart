import { Package } from 'lucide-react';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IOrder } from '@/types/order';
import { Button } from '@/components/ui/button';
import { OrderService } from '@/api/order/order.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import RetryPaymentButton from '@/components/user/RetryPaymentButton';
import OrderDetails from '@/components/user/OrderDetails';

const imageUrl = import.meta.env.VITE_IMAGE_URL + '/products/';

const OrdersSection = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery<IOrder[]>({
    queryKey: ['orders'],
    queryFn: () => OrderService.getOrders(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'Payment Pending':
        return 'bg-red-500';
      case 'Processing':
        return 'bg-blue-500';
      case 'Shipped':
        return 'bg-purple-500';
      case 'Delivered':
        return 'bg-green-500';
      case 'Cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleOrderDetailsClose = () => {
    setShowOrderDetails(false);
  };

  if (isLoading) {
    return <div className="text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Order History</h2>
      {orders.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">You have no recent orders.</p>
              <Button
                className="mt-4"
                onClick={() => (window.location.href = '/')}
              >
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.orderId}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">#{order.orderId}</span>
                    <span>
                      <strong>Date:</strong>{' '}
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(new Date(order.createdAt))}
                    </span>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <img
                            src={imageUrl + item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover"
                          />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-4 space-y-2">
                  <div>
                    {order.items.length > 0 && (
                      <p>
                        <strong>Price:</strong> ₹
                        {order.items
                          .reduce((total, item) => total + item.price, 0)
                          .toFixed(2)}
                      </p>
                    )}
                    {order.deliveryCharge > 0 && (
                      <p>
                        <strong>Delivery Charge:</strong> ₹
                        {order.deliveryCharge.toFixed(2)}
                      </p>
                    )}
                    {order.discount > 0 && (
                      <p className="text-green-500">
                        <strong>Discount:</strong> - ₹
                        {Math.ceil(order.discount)}
                      </p>
                    )}
                    <p className="font-bold">
                      <strong>Total:</strong> ₹{order.price.toFixed(2)}
                    </p>
                  </div>
                  {/*<div>*/}
                  {/*  <strong>Shipping Address:</strong>*/}
                  {/*  {order.address.map((address, index) => (*/}
                  {/*    <p key={index}>{address}</p>*/}
                  {/*  ))}*/}
                  {/*</div>*/}
                  {/*{order.trackingNumber && (*/}
                  {/*  <p>*/}
                  {/*    <strong>Tracking Number:</strong> {order.trackingNumber}*/}
                  {/*  </p>*/}
                  {/*)}*/}
                  <div className="flex gap-2">
                    {order.status === 'Payment Pending' && (
                      <div className="flex justify-end">
                        <RetryPaymentButton
                          orderId={order.orderId}
                          className="bg-green-700"
                        >
                          Retry Payment
                        </RetryPaymentButton>
                      </div>
                    )}
                    <Button
                      className=""
                      onClick={() => {
                        setShowOrderDetails(true);
                        setOrder(order);
                      }}
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={showOrderDetails} onOpenChange={handleOrderDetailsClose}>
        <DialogContent className="max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          <OrderDetails order={order!} onClose={handleOrderDetailsClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersSection;
