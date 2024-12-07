import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { IOrder } from 'shared/types';
import orderEndpoints from '@/api/orderEndpoints';
import OrderDetailsModal from '@/components/admin/OrderDetailsCard';

interface UpdateOrderData {
  orderId: string;
  status:
    | 'Payment Pending'
    | 'Pending'
    | 'Processing'
    | 'Shipped'
    | 'Delivered'
    | 'Cancelled'
    | 'Return Requested'
    | 'Return Pending'
    | 'Return Cancelled'
    | 'Returned';
}

interface IOrderTableProps {
  orders: IOrder[];
  onViewDetails: (order: IOrder) => void;
}

const OrdersTable = ({ orders, onViewDetails }: IOrderTableProps) => {
  const queryClient = useQueryClient();

  const updateOrderMutation = useMutation<unknown, Error, UpdateOrderData>({
    mutationFn: (data: UpdateOrderData) =>
      orderEndpoints.updateOrderStatus(data.orderId, data.status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });

  const handleStatusChange = (
    orderId: string,
    newStatus:
      | 'Payment Pending'
      | 'Pending'
      | 'Processing'
      | 'Shipped'
      | 'Delivered'
      | 'Cancelled'
      | 'Return Requested'
      | 'Return Pending'
      | 'Return Cancelled'
      | 'Returned'
  ) => {
    updateOrderMutation.mutate({ orderId, status: newStatus });
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
          <TableRow key={order.orderId}>
            <TableCell>{order.orderId}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>₹{order.price.toFixed(2)}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  order.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'Processing'
                      ? 'bg-blue-100 text-blue-800'
                      : order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Shipped'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                }`}
              >
                {order.status}
              </span>
            </TableCell>
            <TableCell>
              {new Date(order.orderDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Select
                  onValueChange={value =>
                    handleStatusChange(
                      order.orderId,
                      value as UpdateOrderData['status']
                    )
                  }
                  defaultValue={order.status}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Update Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {order.status === 'Payment Pending' && (
                      <>
                        <SelectItem value="Payment Pending" disabled>
                          Payment Pending
                        </SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </>
                    )}
                    {order.status === 'Processing' && (
                      <>
                        <SelectItem value="Processing" disabled>
                          Processing
                        </SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </>
                    )}
                    {order.status === 'Pending' && (
                      <>
                        <SelectItem value="Pending" disabled>
                          Pending
                        </SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </>
                    )}
                    {order.status === 'Shipped' && (
                      <>
                        <SelectItem value="Shipped" disabled>
                          Shipped
                        </SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                      </>
                    )}
                    {order.status === 'Delivered' && (
                      <SelectItem value="Delivered" disabled>
                        Delivered
                      </SelectItem>
                    )}
                    {order.status === 'Return Requested' && (
                      <>
                        <SelectItem value="Return Requested" disabled>
                          Return Requested
                        </SelectItem>
                        <SelectItem value="Return Pending">Approve</SelectItem>
                        <SelectItem value="Return Cancelled">Deny</SelectItem>
                      </>
                    )}
                    {order.status === 'Return Pending' && (
                      <>
                        <SelectItem value="Return Pending" disabled>
                          Return Pending
                        </SelectItem>
                        <SelectItem value="Returned">Returned</SelectItem>
                      </>
                    )}
                    {order.status === 'Return Cancelled' && (
                      <SelectItem value="Return Cancelled" disabled>
                        Return Cancelled
                      </SelectItem>
                    )}
                    {order.status === 'Returned' && (
                      <SelectItem value="Returned" disabled>
                        Returned
                      </SelectItem>
                    )}
                    {order.status === 'Cancelled' && (
                      <SelectItem value="Cancelled" disabled>
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

function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<IOrder[]>({
    queryKey: ['admin-orders'],
    queryFn: orderEndpoints.getAdminOrders,
  });

  const updateOrderMutation = useMutation<unknown, Error, UpdateOrderData>({
    mutationFn: (data: UpdateOrderData) =>
      orderEndpoints.updateOrderStatus(data.orderId,data.status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated successfully');
    },
    onError: () => {
      toast.error('Failed to update order status');
    },
  });

  const handleViewDetails = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    updateOrderMutation.mutate({
      orderId,
      status: newStatus as UpdateOrderData['status'],
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600">
        Error loading orders. Please try again later.
      </div>
    );
  }

  return (
    <Card className="m-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="relative">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
            <ChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
          </div>
          <div className="relative">
            <Input type="text" placeholder="Search orders" className="pl-10" />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {orders && orders.length > 0 ? (
            <OrdersTable orders={orders} onViewDetails={handleViewDetails} />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No orders available.</p>
            </div>
          )}
        </div>

        {orders && orders.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{orders.length}</span> of{' '}
              <span className="font-medium">{orders.length}</span> results
            </span>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
        />
      </CardContent>
    </Card>
  );
}

export default AdminOrders;
