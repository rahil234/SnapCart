import React from 'react';
import { Eye } from 'lucide-react';

import { Order } from '@/types';
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
import { Button } from '@/components/ui/button';
import { useUpdateOrderStatusMutation } from '@/hooks/orders/use-update-order-status-mutation.hook';

interface IOrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

const OrdersTable: React.FC<IOrderTableProps> = ({ orders, onViewDetails }) => {
  const updateOrderMutation = useUpdateOrderStatusMutation();

  const handleStatusChange = (
    id: string,
    orderStatus: Order['orderStatus']
  ) => {
    updateOrderMutation.mutate({ id, orderStatus });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="">
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
            <TableCell>{order.customer?.customerName}</TableCell>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDetails(order)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
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
                    {order.orderStatus === 'pending' && (
                      <>
                        <SelectItem value="pending" disabled>
                          Pending
                        </SelectItem>
                        <SelectItem value="shipping">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'shipping' && (
                      <>
                        <SelectItem value="Shipped" disabled>
                          Shipped
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
                        <SelectItem value="Returned">Returned</SelectItem>
                      </>
                    )}
                    {order.orderStatus === 'return_rejected' && (
                      <SelectItem value="Return Rejected" disabled>
                        Return Cancelled
                      </SelectItem>
                    )}
                    {order.orderStatus === 'returned' && (
                      <SelectItem value="returned" disabled>
                        Returned
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
