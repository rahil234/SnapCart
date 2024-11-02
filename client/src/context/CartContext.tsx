import cartEndpoints from '@/api/cartEndpoints';
import React, {
    createContext,
    ReactNode,
    useEffect,
    useState,
} from 'react';
import { ICart } from 'shared/types';

interface CartContextProps {
    cartData: ICart | null;
    setCartData: (cart: ICart | null) => void;
}

const CartContext = createContext<CartContextProps>({
    cartData: null,
    setCartData: () => { },
});



export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartData, setCartData] = useState<ICart | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await cartEndpoints.getCart();
                setCartData(response.data.cart);
                console.log('Cart data:', response.data.cart);

            } catch (error) {
                console.error('Error fetching cart data:', error);
            }
        })();
    }, []);

    return (
        <CartContext.Provider
            value={{
                cartData,
                setCartData,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;