import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button';
import cartEndpoints from '@/api/cartEndpoints';
import { Product, ImportMeta } from 'shared/types';
import CartContext from '@/context/CartContext';

const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_BUCKET_URL;
const ProductCard = ({ product }: { product: Product }) => {
    const { cartData } = useContext(CartContext);
    const [cartQuantity, setCartQuantity] = useState(0);

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await cartEndpoints.addToCart(product._id);
        console.log(response);
        setCartQuantity(1);
    };

    useEffect(() => {
        if (cartData) {
            const item = cartData.items.find((item) => item._id === product._id);
            if (item) {
                setCartQuantity(item.quantity);
            }
        }
    }, [cartData]);

    function handleQuantityIncrease() {
        console.log('increase');
        setCartQuantity(cartQuantity + 1);
    }
    function handleQuantityDecrease() {
        console.log('decrease');
        setCartQuantity(cartQuantity - 1);
    }

    return (
        <Link key={String(product._id)} to={'/product/' + product._id} >
            <div className="bg-white rounded-lg object-center shadow p-2 min-w-[170px] flex flex-col ">
                <div className="rounded-sm overflow-hidden">
                    <img
                        src={imageUrl + product.images[0]}
                        alt={product.name}
                        className="object-cover  h-[170px] mb-2"
                    />
                </div>
                <h3 className="font-semibold">{product.name}</h3>
                <h3 className="text-xs">{product.quantity}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">₹{product.price}</p>
                    {cartQuantity > 0 ? (
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
                    ) : (
                        <Button
                            className="border border-[#318615] bg-white text-[#318615] hover:bg-[#318615] hover:text-white"
                            size="sm"
                            onClick={handleAddToCart}
                        >
                            Add
                        </Button>)
                    }
                </div>
            </div>
        </Link >
    )
};

export default ProductCard;
