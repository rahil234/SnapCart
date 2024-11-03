import cartEndpoints from '@/api/cartEndpoints';
import React, {
    createContext,
    ReactNode,
    useEffect,
    useState,
} from 'react';
import { ICartP } from 'shared/types';

interface CartContextProps {
    cartData: ICartP | null;
    setCartData: (cart: ICartP | null) => void;
}

const CartContext = createContext<CartContextProps>({
    cartData: null,
    setCartData: () => { },
});



export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartData, setCartData] = useState<ICartP | null>(null);

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