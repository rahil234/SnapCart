import React, { useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Order } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import OrdersTable from '@/components/admin/OrdersTable';
import { Card, CardContent } from '@/components/ui/card';
import OrderDetailsModal from '@/components/common/OrderDetailsCard';
import { useGetAdminOrders } from '@/hooks/orders/use-get-admin-orders.hook';
import { useUpdateOrderStatusMutation } from '@/hooks/orders/use-update-order-status-mutation.hook';

function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: orders, isLoading, isError } = useGetAdminOrders();

  const updateOrderMutation = useUpdateOrderStatusMutation();

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = async (
    id: string,
    orderStatus: Order['orderStatus']
  ) => {
    await updateOrderMutation.mutateAsync({
      id,
      orderStatus,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError || !orders) {
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

        {selectedOrder && (
          <OrderDetailsModal
            orderId={selectedOrder.id}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default AdminOrders;
