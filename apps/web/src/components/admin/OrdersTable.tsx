import React from 'react';
import { Eye } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { useUpdateOrderStatus } from '@/hooks/orders/use-update-order-status.hook';

interface IOrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

const OrdersTable = ({ orders, onViewDetails }: IOrderTableProps) => {
  const updateOrderMutation = useUpdateOrderStatus();

  const handleStatusChange = (
    id: string,
    orderStatus: Order['orderStatus']
  ) => {
    updateOrderMutation.mutate({ id, orderStatus });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {['Order ID', 'Customer', 'Price', 'Status', 'Date', 'Actions'].map(
            header => (
              <TableHead key={header} className="text-left">
                {header}
              </TableHead>
            )
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(order => (
          <TableRow key={order.id}>
            <TableCell>{order.orderNumber}</TableCell>
            <TableCell>{order.customerId}</TableCell>
            <TableCell>₹{order.total}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.orderStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.orderStatus === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : order.orderStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.orderStatus === 'shipping'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                }`}
              >
                {order.orderStatus}
              </span>
            </TableCell>
            <TableCell>
              {new Date(order.placedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Select
                  onValueChange={value =>
                    handleStatusChange(order.id, value as Order['orderStatus'])
                  }
                  defaultValue={order.orderStatus}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {order.paymentStatus === 'pending' && (
                      <>
                        <SelectItem value="Payment Pending" disabled>
                          Payment Pending
                        </SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'processing' && (
                      <>
                        <SelectItem value="Processing" disabled>
                          Processing
                        </SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'pending' && (
                      <>
                        <SelectItem value="pending" disabled>
                          Pending
                        </SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'shipping' && (
                      <>
                        <SelectItem value="Shipping" disabled>
                          Shipping
                        </SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'delivered' && (
                      <SelectItem value="delivered" disabled>
                        Delivered
                      </SelectItem>
                    )}
                    {order.orderStatus === 'return_requested' && (
                      <>
                        <SelectItem value="return_requested" disabled>
                          Return Requested
                        </SelectItem>
                        <SelectItem value="Return Pending">Approve</SelectItem>
                        <SelectItem value="Return Cancelled">Deny</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'return_approved' && (
                      <>
                        <SelectItem value="return_approved" disabled>
                          Return Pending
                        </SelectItem>
                        <SelectItem value="returned">Returned</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'return_rejected' && (
                      <SelectItem value="return_rejected" disabled>
                        Return Rejected
                      </SelectItem>
                    )}
                    {order.orderStatus === 'returned' && (
                      <SelectItem value="Returned" disabled>
                        Returned
                      </SelectItem>
                    )}
                    {order.orderStatus === 'canceled' && (
                      <SelectItem value="canceled" disabled>
                        Cancelled
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
