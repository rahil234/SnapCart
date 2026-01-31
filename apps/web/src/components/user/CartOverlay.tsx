import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { UIContext } from '@/context/UIContext';
import { Button } from '@/components/ui/button';
import { ImportMeta } from '@/types';
import { AuthState } from '@/features/auth/authSlice';
import { CartState, updateQuantity } from '@/features/cart/cartSlice';
import { useAppDispatch } from '@/app/store';
import { OrderService } from '@/api/order/order.service';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_IMAGE_URL + '/products/';

const CartOverlay = () => {
  const { cartData } = useSelector((state: { cart: CartState }) => state.cart);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { hideCartOverlay } = useContext(UIContext);
  const isAuthenticated = useSelector(
    (state: { auth: AuthState }) => state.auth.user
  );

  const handleCheckout = async () => {
    if (!cartData) return;
    try {
      await OrderService.verifyCheckout();
      navigate('/checkout');
    } catch (error) {
      console.error('Error checking out cart:', error);
    }
  };

  function handleQuantityIncrease(_id: string, cartQuantity: number) {
    dispatch(updateQuantity({ _id, quantity: cartQuantity + 1 }));
  }

  function handleQuantityDecrease(_id: string, cartQuantity: number) {
    dispatch(updateQuantity({ _id, quantity: cartQuantity - 1 }));
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
        {!cartData?.items.length ? (
          <div className="flex items-center justify-center h-full">
            <span>Your cart is empty</span>
          </div>
        ) : (
          <div className="flex flex-col overflow-auto gap-1.5 px-[15px] py-1.5 flex-1 bg-[#f5f7fc]">
            {cartData?.items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center w-full"
              >
                <img
                  className="w-16 h-16 rounded-sm"
                  alt={item?.product.name}
                  src={imageUrl + item?.product?.images[0]}
                />
                <div className="flex flex-col mr-auto ps-2">
                  <span className="text-sm">{item.product.name}</span>
                  <span className="text-sm">
                    ₹{item.offerPrice || item.product.price}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-[#328616] text-white rounded-md p-1">
                  <button
                    className="px-3"
                    onClick={() =>
                      handleQuantityDecrease(item._id, item.quantity)
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-3"
                    onClick={() =>
                      handleQuantityIncrease(item._id, item.quantity)
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
          {Boolean(cartData?.items.length) && (
            <div className="flex justify-between w-full px-4 py-2 bg-white">
              <span className="font-bold">Total:</span>
              <span className="font-bold">₹{cartData?.totalAmount}</span>
            </div>
          )}
          <div className="flex justify-center gap-2.5 w-full">
            {isAuthenticated ? (
              <Button
                type="button"
                className="bg-[#0E8320] text-white w-full"
                onClick={handleCheckout}
                disabled={!cartData?.items.length}
              >
                {cartData?.items.length ? 'Order Now' : 'Add Items to Order'}
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
