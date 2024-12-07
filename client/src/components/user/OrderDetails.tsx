import React, { useState } from 'react';
import { AlertCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IOrder } from 'shared/types';
import orderEndpoints from '@/api/orderEndpoints';
import { ImportMeta } from '@types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import OrderReturnCard from '@/components/user/OrderReturnCard';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/products/';

interface IOrderDetails {
  order: IOrder;
  onClose: () => void;
}

const OrderDetails = ({ order, onClose }: IOrderDetails) => {
  const [returnDialog, setReturnDialog] = useState(false);

  const queryClient = useQueryClient();

  const handleCancelOrder = async () => {
    try {
      console.log(order.orderId);
      await orderEndpoints.cancelOrder(order.orderId);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order cancelled successfully');
      console.log(`Cancelling order ₹{order.orderId}`);
      onClose();
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const handleCancelItem = async (itemId: string) => {
    try {
      await orderEndpoints.cancelOrderItem(order.orderId, itemId);
      console.log(`Cancelling item ₹{itemId} from order ₹{order.orderId}`);
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Item cancelled successfully');
      onClose();
    } catch (error) {
      console.error('Error cancelling item:', error);
    }
  };

  // const handleReturnOrder = async () => {
  //   try {
  //     await orderEndpoints.updateOrderStatus(order.orderId, 'Return Requested');
  //     console.log(`Returning order ₹{order.orderId}`);
  //   } catch (error) {
  //     console.error('Error returning order:', error);
  //   }
  // };

  const handleGetInvoice = async (orderId: string) => {
    try {
      const response = await orderEndpoints.getInvoice(order.orderId);

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      console.log(url);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();

      if (link?.parentNode) link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the receipt:', error);
    }
  };

  return (
    <div className="bg-white mx-auto rounded-lg">
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="font-semibold">Order ID:</p>
          <p>#{order.orderId}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Order Date:</p>
          <p>{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Payment Method:</p>
          <p>{order.paymentMethod}</p>
        </div>
        {/*<div className="flex justify-between">*/}
        {/*  <p className="font-semibold">Payment Status:</p>*/}
        {/*  <p>{order.paymentStatus}</p>*/}
        {/*</div>*/}
        <div className="flex justify-between">
          <p className="font-semibold">Order Status:</p>
          <p>{order.status}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Shipping Address:</p>
          <p>
            {order.address &&
              order.address.map((address: string) => `${address},\n`)}
          </p>
        </div>
        {/*<div className="flex justify-between">*/}
        {/*  <p className="font-semibold">Shipping Method:</p>*/}
        {/*  <p>{order.shippingMethod}</p>*/}
        {/*</div>*/}
        {/*<div className="flex justify-between">*/}
        {/*  <p className="font-semibold">Shipping Fee:</p>*/}
        {/*  <p>${order.shippingFee.toFixed(2)}</p>*/}
        {/*</div>*/}
        <div className="flex justify-between">
          <p className="font-semibold">Subtotal:</p>
          <p>
            ₹
            {order.items
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Delivery Charge:</p>
          <p>₹{order.deliveryCharge.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Discount:</p>
          <p>- ₹{order.discount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p className="font-semibold">Total:</p>
          <p>₹{order.price.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-5 felx gap-3 justify-end w-full">
        {order.status === 'Delivered'? (
          <div className="flex gap-2 justify-end items-center">
            <Dialog open={returnDialog}>
              <DialogHeader>
                <DialogTrigger>
                  <Button onClick={() => setReturnDialog(true)}>
                    Return Order
                  </Button>
                </DialogTrigger>
              </DialogHeader>
              <DialogContent className="max-h-[70vh] overflow-y-auto">
                <DialogTitle>Return Order</DialogTitle>
                <DialogDescription></DialogDescription>
                <OrderReturnCard
                  order={order}
                  onClose={() => setReturnDialog(false)}
                />
              </DialogContent>
            </Dialog>
            <Button onClick={() => handleGetInvoice(order.orderId)}>
              invoice
              <Download className="w-5 h-5 ml-2" />
            </Button>
          </div>
        ) : order.status === 'Shipped' || order.status === 'Processing' || order.status === 'Pending' && (
          <div>
            <Button onClick={handleCancelOrder}>Cancel Order</Button>
          </div>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-2">Items</h3>
        <div className="space-y-4">
          {order.items.map(item => (
            <div
              key={item._id}
              className="flex justify-between items-center border-b pb-4 gap-8"
            >
              <div className="flex items-center">
                <img
                  src={
                    imageUrl + item.image || 'https://via.placeholder.com/150'
                  }
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm">Price: ₹{item.price.toFixed(2)}</p>
                  <p className="text-sm">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div>{item.status}</div>
              {item.status !== 'Delivered' && item.status !== 'Cancelled' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelItem(item._id)}
                >
                  Cancel Item
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/*{order.status === 'Processing' && (*/}
      {/*  <div className="mt-6 flex justify-between items-center">*/}
      {/*    <Button variant="destructive" onClick={handleCancelOrder}>*/}
      {/*      Cancel Order*/}
      {/*    </Button>*/}
      {/*    <div className="flex items-center text-yellow-600">*/}
      {/*      <AlertCircle className="w-5 h-5 mr-2" />*/}
      {/*      <span>Cancellation is only available for processing orders</span>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
      {order.status === 'Delivered' && (
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center text-green-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>Order has been delivered</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
