import { motion } from 'motion/react';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { UIContext } from '@/context/UIContext';
import { Button } from '@/components/ui/button';
import { RootState, useAppDispatch } from '@/store/store';
import { removeItem, updateQuantity } from '@/store/cart/cartSlice';
// import { OrderService } from '@/services/order.service';

const CartOverlay = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { hideCartOverlay } = useContext(UIContext);

  const handleCheckout = async () => {
    if (!items.length) return;
    try {
      // await OrderService.verifyCheckout();
      navigate('/checkout');
    } catch (error) {
      console.error('Error checking out cart:', error);
    }
  };

  function handleQuantityIncrease(id: string, quantity: number) {
    dispatch(updateQuantity({ id, quantity: quantity + 1 }));
  }

  function handleQuantityDecrease(id: string, quantity: number) {
    if (quantity < 2) {
      dispatch(removeItem({ id }));
      return;
    }
    dispatch(updateQuantity({ id, quantity: quantity - 1 }));
  }

  const handleViewCart = () => {
    hideCartOverlay();
    navigate('/cart');
  };

  return (
    <motion.div
      className={`fixed top-0 left-0 w-full h-full right bg-black bg-opacity-20 backdrop-blur-sm z-40 transition-all duration-500 ease-in-out`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.5 } }}
      onClick={() => hideCartOverlay()}
    >
      <motion.div
        className={`absolute flex flex-col pb-14 top-14 right-0 transition-all duration-500 ease-in-out h-full w-[340px] lg:w-[471px] bg-white shadow-lg z-50`}
        initial={{ x: 471, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 471 }}
        transition={{ duration: 0, delay: 0.3 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-[15px] bg-white">
          <div className="font-extrabold text-black text-lg">My Cart</div>
          <button onClick={() => hideCartOverlay()} className="text-black">
            ✕
          </button>
        </div>
        {!items.length ? (
          <div className="flex items-center justify-center h-full">
            <span>Your cart is empty</span>
          </div>
        ) : (
          <div className="flex flex-col overflow-auto gap-1.5 px-[15px] py-1.5 flex-1 bg-[#f5f7fc]">
            {items.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center w-full"
              >
                <img
                  className="w-16 h-16 rounded-sm"
                  alt={item.variant.variantName}
                  src={item.variant.imageUrl}
                />
                <div className="flex flex-col mr-auto ps-2">
                  <span className="text-sm">{item.variant.variantName}</span>
                  <span className="text-sm">₹{item.variant.price}</span>
                </div>
                <div className="flex items-center justify-between bg-[#328616] text-white rounded-md p-1">
                  <button
                    className="px-3"
                    onClick={() =>
                      handleQuantityDecrease(item.id, item.quantity)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-3"
                    onClick={() =>
                      handleQuantityIncrease(item.id, item.quantity)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col items-center gap-2.5 p-2.5 w-full">
          {Boolean(items.length) && (
            <div className="flex justify-between w-full px-4 py-2 bg-white">
              <span className="font-bold">Total:</span>
              <span className="font-bold">₹{totalAmount}</span>
            </div>
          )}
          <div className="flex justify-center gap-2.5 w-full">
            {isAuthenticated ? (
              <Button
                type="button"
                className="bg-[#0E8320] text-white w-full"
                onClick={handleCheckout}
                disabled={!items.length}
              >
                {items.length ? 'Order Now' : 'Add Items to Order'}
              </Button>
            ) : (
              <Button type="button" className="bg-[#0E8320] text-white w-full">
                Login to Order
              </Button>
            )}
            <Button
              className="bg-white text-[#0E8320] border border-[#0E8320]"
              onClick={handleViewCart}
            >
              View Cart
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CartOverlay;
