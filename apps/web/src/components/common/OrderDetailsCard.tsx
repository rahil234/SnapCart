import React, { useEffect } from 'react';

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
import { IOrder } from '@/types/order';

const imageUrl = import.meta.env.VITE_IMAGE_URL + '/products/';

interface OrderDetailsModalProps {
  order: IOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  useEffect(() => {
    console.log('OrderDetailsModal mounted', order);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[70vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            # {order.orderId} | Order status: <strong>{order.status}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
            <p>
              <strong>Name:</strong> {order.orderedBy.firstName}
            </p>
            <p>
              <strong>Email:</strong> {order.orderedBy.email}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Information</h3>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(order.orderDate).toLocaleString()}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.price.toFixed(2)}
            </p>
            <p>
              <strong>Payment Method:</strong> {order.paymentMethod}
            </p>
            <p>
              <strong>Address:</strong> {order.address.join(', ')}
            </p>
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
                      src={imageUrl + item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
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
