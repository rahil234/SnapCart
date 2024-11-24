import React from 'react';
// import RetryPaymentButton from '@/components/user/RetryPaymentButton';
import { IOrder } from 'shared/types';

interface IOrderDetails {
  order: IOrder;
  onClose: () => void;
}

const OrderDetails = ({ order, onClose }: IOrderDetails) => {
  console.log(order);
  return (
      <div className="bg-white mx-auto my-5 rounded-lg">
        <h2 className="text-2xl font-bold">Order Details</h2>
        <div className="">
          <div className="flex justify-between">
            <p>Order ID:</p>
            <p>{order.orderId}</p>
          </div>
          <div className="flex justify-between">
            <p>Order Date:</p>
            <p>{(new Date(order.orderDate)).toLocaleDateString()}</p>
          </div>
          <div className="flex justify-between">
            <p>Payment Method:</p>
            <p>Credit Card</p>
          </div>
          <div className="flex justify-between">
            <p>Payment Status:</p>
            <p>Payment Pending</p>
          </div>
          <div className="flex justify-between">
            <p>Order Status:</p>
            <p>Processing</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Address:</p>
            <p>123 Main St, New York, NY 10001</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Method:</p>
            <p>Standard Shipping</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping Fee:</p>
            <p>$5.00</p>
          </div>
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>$100.00</p>
          </div>
          <div className="flex justify-between">
            <p>Discount:</p>
            <p>$0.00</p>
          </div>
          <div className="flex justify-between">
            <p>Total:</p>
            <p>$105.00</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-xl font-bold">Items</h3>
          <div className="mt-2">
            <div className="flex justify-between">
              <div className="flex items-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Product"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <p>Product Name</p>
                  <p>Price: $20.00</p>
                  <p>Quantity: 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default OrderDetails;
