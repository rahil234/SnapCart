import React from 'react';

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
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Order } from '@/types';
import { useGetAdminOrder } from '@/hooks/orders/use-get-admin-order.hook';

interface OrderDetailsModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: Order['orderStatus']) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const { data: order, isLoading, error } = useGetAdminOrder(orderId);

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[70vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Loading...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (!order || error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[70vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Unable to load order details. Please try again later.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  console.log('Order details:', order);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            # {order.orderNumber} | Order status:{' '}
            <strong>{order.orderStatus}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <p>
              <strong>Name:</strong> {order.customer?.customerName}
            </p>
            <p>
              <strong>Email:</strong> {order.customer?.customerEmail}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Information</h3>
            <p>
              <strong>Date:</strong> {new Date(order.placedAt).toLocaleString()}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.total}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            {/*<p>*/}
            {/*  <strong>Address:</strong> {order.address.join(', ')}*/}
            {/*</p>*/}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      src={item?.imageUrl || '/placeholder.png'}
                      alt={item.productName}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>{item.variantName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.finalPrice}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
