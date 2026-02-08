import { toast } from 'sonner';
import { Link } from 'react-router';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import {
  addItemToCart,
  removeItem,
  updateQuantity,
} from '@/store/cart/cartSlice';
import { Button } from '@/components/ui/button';
import { RootState, useAppDispatch } from '@/store/store';
import { Category, Product, ProductVariant } from '@/types';

interface ProductCardProps {
  product: Pick<Product, 'id' | 'name'> & {
    variant: Pick<ProductVariant, 'id' | 'variantName' | 'price' | 'stock'> & {
      imageUrl: string;
    };
    category: Pick<Category, 'id' | 'name'>;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { items } = useSelector((state: RootState) => state.cart);

  const cartItem = useMemo(() => {
    return items.find(item => item.variant.id === product.variant.id);
  }, [items, product.variant.id]);

  const dispatch = useAppDispatch();

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    dispatch(
      addItemToCart({
        productId: product.id,
        variantId: product.variant.id,
        quantity: 1,
      })
    );
  };

  function handleQuantityIncrease() {
    if (!cartItem) return;

    if (cartItem?.quantity >= 10) {
      toast.error('You can add only 10 items at a time');
      return;
    }
    dispatch(
      updateQuantity({ id: cartItem.id, quantity: cartItem.quantity + 1 })
    );
  }

  function handleQuantityDecrease() {
    if (!cartItem) return;

    if (cartItem.quantity <= 1) {
      dispatch(removeItem({ id: cartItem.id }));
      return;
    }

    dispatch(
      updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 })
    );
  }

  return (
    <Link
      key={String(product.id)}
      to={'/product/' + product.id + '?variant=' + product.variant.id}
      className="bg-white rounded-lg object-center shadow p-2 w-[160px] h-[240px] lg:w-[190px] lg:h-[270px] flex flex-col flex-shrink-0"
    >
      <div className="rounded-sm overflow-hidden">
        <img
          src={product.variant?.imageUrl}
          alt={product.name}
          className="object-cover  h-[170px] mb-2"
        />
      </div>
      <h3 className="font-semibold">{product.name}</h3>
      <h3 className="text-xs">{product.variant.variantName}</h3>
      <div className="flex items-center justify-between">
        <p className="text-gray-600">₹{product.variant.price}</p>
        {cartItem ? (
          <div
            className="flex items-center justify-between bg-[#328616] text-white rounded-md p-1"
            onClick={e => e.preventDefault()}
          >
            <button className="px-3" onClick={handleQuantityDecrease}>
              -
            </button>
            <span>{cartItem.quantity}</span>
            <button className="px-3" onClick={handleQuantityIncrease}>
              +
            </button>
          </div>
        ) : product.variant.stock === 0 ? (
          <div className="bg-white text-[#9e2121] text-sm h-[32px] flex items-center">
            <span>Out of Stock</span>
          </div>
        ) : (
          <Button
            className="border border-[#318615] bg-white text-[#318615] hover:bg-[#318615] hover:text-white"
            size="sm"
            onClick={handleAddToCart}
          >
            Add
          </Button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
