import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UIContext } from '@/context/UIContext';
import { Button } from '@/components/ui/button';

const fakeCartData = [
  { name: 'Nestle Fruits Cereal', price: '₹120', quantity: 1 },
  { name: 'Amul Cheese', price: '₹60', quantity: 1 },
];

const CartOverlay = () => {
  const { hideCartOverlay } = useContext(UIContext);
  const isAuthenticated = useSelector((state: { auth: { isAuthenticated: boolean } }) => state.auth.isAuthenticated);
  const handleClose = () => {
    hideCartOverlay();
  };

  const totalPrice = fakeCartData.reduce((total, item) => {
    const price = parseInt(item.price.replace('₹', ''), 10);
    return total + price * item.quantity;
  }, 0);

  return (
    <>
      <div className="fixed top-14  right-0 h-full w-[471px] bg-white shadow-lg z-50">
        <div className="flex items-start justify-between p-[15px] bg-white">
          <div className="font-extrabold text-black text-lg">
            My Cart
          </div>
          <button onClick={handleClose} className="text-black">
            ✕
          </button>
        </div>
        <div className="flex flex-col items-center gap-2.5 px-[15px] py-2.5 flex-1 bg-[#f5f7fc]">
          {fakeCartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between w-full">
              <span>{item.name}</span>
              <span className="ml-auto">{item.price}</span>
              <div className="flex items-center">
                <button className="px-2">+</button>
                <span>{item.quantity}</span>
                <button className="px-2">-</button>
                <img
                  className="w-5 h-5"
                  alt="Remove item"
                  src="/path/to/remove-icon.svg"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2.5 p-2.5 w-full">
          <div className="flex justify-between w-full px-4 py-2 bg-white">
            <span className="font-bold">Total:</span>
            <span className="font-bold">₹{totalPrice}</span>
          </div>
          <div className="flex justify-center gap-2.5 w-full">
            {isAuthenticated ? (
              <Button type="button" className="bg-green-500 text-white w-full">
                Order Now
              </Button>
            ) : <Button type="button" className="bg-green-500 text-white w-full">
                Login to Order
              </Button>
              }
            <Link to={'/cart'}>
              <Button size="sm" variant="secondary" className="bg-white text-green-500 border border-green-500 w-full">
                View Cart
              </Button>
            </Link>
          </div>
        </div>
      </div >
      <div
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={handleClose}
      ></div>
    </>
  );
};

export default CartOverlay;