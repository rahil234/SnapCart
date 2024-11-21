import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Product, ImportMeta } from 'shared/types';
import { useSelector } from 'react-redux';
import { CartState, addItemToCart, updateQuantity } from '@/features/cart/cartSlice';
import { useAppDispatch } from '@/app/store';
import { AuthState } from '@/features/auth/authSlice';
import { UIContext } from '@/context/UIContext';
import { toast } from 'sonner';

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_BUCKET_URL+ '/';


const ProductCard = ({ product }: { product: Product }) => {
    const [cartQuantity, setCartQuantity] = useState<number>(0);

    const { showLoginOverlay } = useContext(UIContext);
    const { user } = useSelector((state: { auth: AuthState }) => state.auth);
    const { cartData } = useSelector((state: { cart: CartState }) => state.cart);

    const dispatch = useAppDispatch();

    useEffect(() => {
        setCartQuantity(cartData?.items.find(item => item._id === product._id)?.quantity || 0);
    }, [cartData]);

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!user) {
            showLoginOverlay();
            return;
        }
        dispatch(addItemToCart({ _id: product._id, product }));
    };

    function handleQuantityIncrease() {
        if (cartQuantity >= product.stock) {
            toast.error('Out of stock');
            return;
        } else if (cartQuantity >= 10) {
            toast.error('You can add only 10 items at a time');
            return;
        }
        dispatch(updateQuantity({ _id: product._id, quantity: cartQuantity + 1 }));
    }

    function handleQuantityDecrease() {
        dispatch(updateQuantity({ _id: product._id, quantity: cartQuantity - 1 }));
    }

    return (
        <Link key={String(product._id)} to={'/product/' + product._id} >
            <div className="bg-white rounded-lg object-center shadow p-2 w-[170px] h-[260px] flex flex-col">
                <div className="rounded-sm overflow-hidden">
                    <img
                        src={imageUrl + product.images[0]}
                        alt={product.name}
                        className="object-cover  h-[170px] mb-2"
                    />
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <h3 className="text-xs">{product.variantName}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">₹{product.price}</p>
                    {cartQuantity > 0 ?
                        <div className="flex items-center justify-between bg-[#328616] text-white rounded-md p-1"
                            onClick={(e) => e.preventDefault()}
                        >
                            <button
                                className="px-3"
                                onClick={handleQuantityDecrease}
                            >
                                -
                            </button>
                            <span>{cartQuantity}</span>
                            <button
                                className="px-3"
                                onClick={handleQuantityIncrease}
                            >
                                +
                            </button>
                        </div>
                        :
                        product.stock === 0 ?
                            <div
                                className="bg-white text-[#9e2121] text-sm h-[32px] flex items-center">
                                <span>
                                    Out of Stock
                                </span>
                            </div> :
                            <Button
                                className="border border-[#318615] bg-white text-[#318615] hover:bg-[#318615] hover:text-white"
                                size="sm"
                                onClick={handleAddToCart}
                            >
                                Add
                            </Button>
                    }
                </div>
            </div>
        </Link >
    )
};

export default ProductCard;
