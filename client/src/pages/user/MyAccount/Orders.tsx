import React, { useState } from 'react';
import orderEndpoints from '@/api/orderEndpoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ImportMeta } from '@types';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import OrderDetails from '@/components/user/OrderDetails';
import { IOrder } from 'shared/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/';

const OrdersSection = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery<IOrder[]>({
    queryKey: ['orders'],
    queryFn: () => orderEndpoints.getOrders(),
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

  const handleCancelItem = async (orderId: string, itemId: string) => {
    try {
      await orderEndpoints.cancelOrderItem(orderId, itemId);
      toast.success('Item cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel item:', error);
      toast.error('Failed to cancel item. Please try again.');
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
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
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
                        <TableCell>
                          <Badge className={getStatusColor(item.status!)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleCancelItem(order.orderId, item._id)
                            }
                            disabled={
                              item.status === 'Delivered' ||
                              item.status === 'Shipped' ||
                              item.status === 'Cancelled'
                            }
                          >
                            Cancel Item
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-4 space-y-2">
                  <p>
                    <strong>Total:</strong> ₹{order.price.toFixed(2)}
                  </p>
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
                  {/*  {order.status === 'Payment Pending' && (*/}
                  {/*    <div className="flex justify-end">*/}
                  {/*      <RetryPaymentButton orderId={order.orderId}>*/}
                  {/*        Retry Payment*/}
                  {/*      </RetryPaymentButton>*/}
                  {/*    </div>*/}
                  {/*  )}*/}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={showOrderDetails} onOpenChange={handleOrderDetailsClose}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        </DialogTrigger>
        <DialogContent>
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
