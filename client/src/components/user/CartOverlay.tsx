import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UIContext } from '@/context/UIContext';
import { Button } from '@/components/ui/button';
import { ImportMeta } from 'shared/types';
// import cartEndpoints from '@/api/cartEndpoints';
import CartContext from '@/context/CartContext';

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_imageUrl;

const CartOverlay = () => {
  const { cartData } = useContext(CartContext);

  const navigate = useNavigate();

  const { hideCartOverlay } = useContext(UIContext);
  const isAuthenticated = useSelector((state: { auth: { isAuthenticated: boolean } }) => state.auth.isAuthenticated);


  const handleQuantityIncrease = (productId: string, currentQuantity: number) => {
    const updatedItems = cartData?.items.map(item =>
      item._id === productId
        ? { ...item, quantity: currentQuantity + 1 }
        : item
    );
    if (updatedItems) {
      // setCartData((prevState: ICart | null) => prevState ? { ...prevState, items: updatedItems } : null);
      // updateTotalPrice(updatedItems);
    }
  };

  const handleQuantityDecrease = (productId: string, currentQuantity: number) => {
    const updatedItems = cartData?.items
      .map(item =>
        item.product._id === productId
          ? { ...item, quantity: currentQuantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0); // Remove items with quantity 0

    if (updatedItems) {
      // setCartData(prevState => prevState ? { ...prevState, items: updatedItems } : null);
      // updateTotalPrice(updatedItems);
    }
  };

  // const updateTotalPrice = (items: ICart['items']) => {
    // const totalPrice = items.reduce((total, item) => total + item.productId.price * item.quantity, 0);
    // setCartData((prevState: ICart) => prevState ? { ...prevState, totalPrice } : null);
  // };

  const handleViewCart = () => {
    hideCartOverlay();
    navigate('/cart');
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => hideCartOverlay()}
    >
      <div
        className="absolute top-14 right-0 h-full w-[471px] bg-white shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-[15px] bg-white">
          <div className="font-extrabold text-black text-lg">
            My Cart
          </div>
          <button onClick={() => hideCartOverlay()} className="text-black">
            ✕
          </button>
        </div>
        <div className="flex flex-col justify-between gap-1.5 px-[15px] py-1.5 flex-1 bg-[#f5f7fc]">
          {cartData?.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center w-full">
              <img
                className="w-16 h-16 rounded-sm"
                alt={item.product.name}
                src={imageUrl + item.product.images[0]}
              />
              <div className="flex flex-col mr-auto ps-2">
                <span className="text-sm">{item.product.name}</span>
                <span className="text-sm">₹{item.product.price}</span>
              </div>
              <div className="flex items-center justify-between bg-[#328616] text-white rounded-md p-1">
                <button
                  className="px-3"
                  onClick={() => handleQuantityDecrease(item._id, item.quantity)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="px-3"
                  onClick={() => handleQuantityIncrease(item._id, item.quantity)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2.5 p-2.5 w-full">
          <div className="flex justify-between w-full px-4 py-2 bg-white">
            <span className="font-bold">Total:</span>
            <span className="font-bold">₹{cartData?.totalPrice}</span>
          </div>
          <div className="flex justify-center gap-2.5 w-full">
            {isAuthenticated ? (
              <Button type="button" className="bg-[#0E8320] text-white w-full">
                Order Now
              </Button>
            ) : (
              <Button type="button" className="bg-[#0E8320] text-white w-full">
                Login to Order
              </Button>
            )}
            <Button size="sm" variant="secondary" className="bg-white text-[#0E8320] border border-[#0E8320]"
              onClick={handleViewCart}>
              View Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartOverlay;