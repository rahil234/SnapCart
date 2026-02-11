import { Package } from 'lucide-react';
import React, { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order, OrderStatus } from '@/types/order';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import OrderDetails from '@/components/user/OrderDetails';
import RetryPaymentButton from '@/components/user/RetryPaymentButton';
import { useGetMyOrders } from '@/hooks/orders/use-get-my-orders.hook';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrdersSection = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { data: orders, isLoading, error } = useGetMyOrders();

  const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
    pending: 'bg-yellow-500',
    // 'Payment Pending': 'bg-red-500',
    processing: 'bg-blue-500',
    shipping: 'bg-purple-500',
    delivered: 'bg-green-500',
    return_approved: 'bg-yellow-500',
    return_requested: 'bg-yellow-500',
    return_rejected: 'bg-red-500',
    returned: 'bg-gray-500',
    canceled: 'bg-gray-500',
  };

  const getStatusColor = (status: OrderStatus) => ORDER_STATUS_COLOR[status];

  if (isLoading) {
    return <div className="text-center">Loading orders...</div>;
  }

  if (error || !orders) {
    return (
      <div className="text-center text-red-500">{error && error.message}</div>
    );
  }

  if (orders.length === 0) {
    return (
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
    );
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
            <Card key={order.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center w-full">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">#{order.orderNumber}</span>
                    <span>
                      <strong>Date:</strong>{' '}
                      {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(new Date(order.placedAt))}
                    </span>
                  </div>
                  <Badge className={getStatusColor(order.orderStatus)}>
                    {order.orderStatus}
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
                            src={item.imageUrl || '/placeholder.png'}
                            alt={item.productName}
                            className="w-16 h-16 object-cover"
                          />
                        </TableCell>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>₹{item.finalPrice}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          ₹{item.finalPrice * item.quantity}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between mt-4 space-y-2">
                  <div>
                    {order.items.length > 0 && (
                      <p>
                        <strong>Subtotal:</strong> ₹{order.subtotal}
                      </p>
                    )}
                    <p>
                      <strong>Delivery Charge:</strong> ₹{order.shippingCharge}
                    </p>
                    {order.discount > 0 && (
                      <p className="text-green-500">
                        <strong>Discount:</strong> - ₹
                        {Math.ceil(order.discount)}
                      </p>
                    )}
                    <p className="font-bold">
                      <strong>Total:</strong> ₹{order.total}
                    </p>
                  </div>
                  <div>
                    <strong>Shipping Address:</strong>
                    {order.shippingAddress && (
                      <div className="text-sm">
                        <p>{order.shippingAddress['fullName']}</p>
                        <p>
                          {order.shippingAddress['addressLine1']},{' '}
                          {order.shippingAddress['addressLine2']}
                        </p>
                        <p>
                          {order.shippingAddress['city']},{' '}
                          {order.shippingAddress['state']} -{' '}
                          {order.shippingAddress['postalCode']}
                        </p>
                        <p>{order.shippingAddress['country']}</p>
                        <p>Phone: {order.shippingAddress['phoneNumber']}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {order.orderStatus === 'pending' && (
                      <div className="flex justify-end">
                        <RetryPaymentButton
                          orderId={order.id}
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
                        setSelectedOrder(order);
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

      <Dialog
        open={showOrderDetails}
        onOpenChange={() => setShowOrderDetails(false)}
      >
        <DialogContent className="max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersSection;
