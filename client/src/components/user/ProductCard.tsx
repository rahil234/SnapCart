import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button';
import { Product, ImportMeta } from 'shared/types';


const imageUrl = (import.meta as unknown as ImportMeta).env.VITE_BUCKET_URL;

const ProductCard = ({ product }: { product: Product }) => {


    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('Add to cart');
    };

    return (
        <Link key={product._id} to={'/product/' + product._id}>
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
                    <Button
                        className="border border-[#318615] bg-white text-[#318615] hover:bg-[#318615] hover:text-white"
                        size="sm"
                        onClick={handleAddToCart}
                    >
                        Add
                    </Button>
                </div>
            </div>
        </Link>
    )
};

export default ProductCard;