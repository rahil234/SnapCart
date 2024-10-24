import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const initialCartData = [
  { id: 1, name: 'Nestle Fruits Cereal', price: '₹120', quantity: 1 },
  { id: 2, name: 'Amul Cheese', price: '₹60', quantity: 1 },
];

const CartPage: React.FC = () => {
  const [cartData, setCartData] = useState(initialCartData);

  const handleIncreaseQuantity = (id: number) => {
    setCartData(prevCartData =>
      prevCartData.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    // Plan: Make API request to update quantity on the server
  };

  const handleDecreaseQuantity = (id: number) => {
    setCartData(prevCartData =>
      prevCartData.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    // Plan: Make API request to update quantity on the server
  };

  const handleRemoveItem = (id: number) => {
    setCartData(prevCartData => prevCartData.filter(item => item.id !== id));
    // Plan: Make API request to remove item from the server
  };

  const totalPrice = cartData.reduce((total, item) => {
    const price = parseInt(item.price.replace('₹', ''), 10);
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartData.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Item</th>
              <th className="py-2">Price</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Total</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartData.map((item, index) => (
              <tr key={index} className="text-center">
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.price}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2">₹{parseInt(item.price.replace('₹', ''), 10) * item.quantity}</td>
                <td className="py-2">
                  <button className="px-2" onClick={() => handleIncreaseQuantity(item.id)}>+</button>
                  <button className="px-2" onClick={() => handleDecreaseQuantity(item.id)}>-</button>
                  <button className="px-2 text-red-500" onClick={() => handleRemoveItem(item.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xl font-bold">Total: ₹{totalPrice}</span>
        <Button type="button" className="bg-green-500 text-white">
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;