import {
  Link,
  Navigate,
  NavLink,
  ScrollRestoration,
  useLocation,
  useParams,
} from 'react-router';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { ChevronRight } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import { ProductVariant } from '@/types';
import { UIContext } from '@/context/UIContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RootState, useAppDispatch } from '@/store/store';
import ZoomableImage from '@/components/user/ZoomableImage';
import ProductNotFound from '@/components/user/ProductNotFound';
import RelatedProducts from '@/components/user/RelatedProducts';
import { addItemToCart, updateQuantity } from '@/store/cart/cartSlice';
import { useGetProductById } from '@/hooks/products/use-get-product-by-id.hook';

const ProductPage: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  const { productId } = useParams<{ productId: string }>();

  const { search } = useLocation();

  const variantId = new URLSearchParams(search).get('variant');

  const { showLoginOverlay } = useContext(UIContext);

  const dispatch = useAppDispatch();

  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);

  if (!productId) return <Navigate to="/" />;

  const { data: product, isLoading } = useGetProductById(productId);

  useEffect(() => {
    if (product) {
      const variant =
        product.variants.find(v => v.id === variantId) || product.variants[0];
      setSelectedVariant(variant);
    }
  }, [variantId, product]);

  useEffect(() => {
    if (product) {
      setMainImage(selectedVariant?.images[0]);
    }
  }, [selectedVariant, product]);

  const cartItem = useMemo(() => {
    if (!selectedVariant) return null;

    return items.find(item => item.variant.id === selectedVariant.id) || null;
  }, [items, selectedVariant]);

  const handleAddToCart = () => {
    if (!user) {
      showLoginOverlay();
      return;
    }

    if (!selectedVariant) {
      toast.error('Please select a product variant');
      return;
    }

    dispatch(
      addItemToCart({
        productId: selectedVariant.productId,
        variantId: selectedVariant.id,
        quantity: 1,
      })
    );
  };

  const handleIncreaseQuantity = () => {
    if (!selectedVariant) return;

    if (!cartItem) {
      toast.error('Item not found in cart');
      return;
    }

    if (cartItem.quantity >= selectedVariant.stock) {
      toast.error('Out of stock');
      return;
    }

    if (cartItem.quantity >= 10) {
      toast.error('You can add only 10 items at a time');
      return;
    }

    if (!cartItem) {
      toast.error('Item not found in cart');
      return;
    }

    dispatch(
      updateQuantity({
        id: cartItem.id,
        quantity: cartItem.quantity + 1,
      })
    );
  };

  const handleDecreaseQuantity = () => {
    if (!selectedVariant) {
      toast.error('Please select a product variant');
      return;
    }

    if (!cartItem) {
      toast.error('Item not found in cart');
      return;
    }

    dispatch(
      updateQuantity({ id: cartItem.id, quantity: cartItem.quantity - 1 })
    );
  };

  if (isLoading) {
    return (
      <main>
        <div className="flex flex-col md:flex-row gap-8 m-4">
          <div className="md:w-1/2 flex flex-col justify-center items-center">
            <Skeleton className="w-96 h-96 mb-4" />
            <div className="flex space-x-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6].map(value => (
                <Skeleton key={value} className={`w-20 h-20`} />
              ))}
            </div>
          </div>
          <div>
            <Skeleton className="mt-5 w-96 h-5"></Skeleton>
          </div>
        </div>
      </main>
    );
  }

  if (!product) return <ProductNotFound></ProductNotFound>;

  if (!selectedVariant) return <ProductNotFound></ProductNotFound>;

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollRestoration />
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-4">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <NavLink to="/" className="text-gray-600">
                Home
              </NavLink>
              <ChevronRight size={16} className="mx-2" />
            </li>
            <li className="flex items-center">
              <NavLink
                to={`/category/${product.category.id}`}
                className="text-gray-600"
              >
                {product.category.name}
              </NavLink>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product images */}
          <div className="md:w-1/2">
            {mainImage ? (
              <ZoomableImage src={mainImage} alt={product.name} />
            ) : (
              <div className="w-full h-96 bg-gray-200 mb-4 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
            <div className="flex space-x-2 flex-wrap">
              {selectedVariant.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover cursor-pointer border-2 ${mainImage === image ? 'border-green-500' : 'border-transparent'} hover:border-green-500`}
                  onClick={() => setMainImage(image)}
                  onMouseEnter={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>

            {/* Product variants */}
            <div className="flex gap-2">
              {product.variants &&
                product.variants.map((variant, index) => (
                  <Link
                    key={index}
                    replace
                    to={`/product/${product.id}?variant=${variant.id}`}
                    className={`mt-10 mb-4 border-2 w-fit p-1 px-4 rounded-lg flex flex-col ${
                      selectedVariant?.id === variant.id
                        ? 'border-green-500'
                        : ''
                    }`}
                  >
                    <span className="text-green-700">{`₹${variant.price}`}</span>
                    <span>{variant.variantName}</span>
                  </Link>
                ))}
            </div>

            {/*Variant price */}
            {selectedVariant.discountPercent ? (
              <div className="flex items-center mb-1">
                <p className="text-3xl font-bold text-green-600 mr-2">
                  ₹{selectedVariant.finalPrice}
                </p>
                <p className="text-xl text-gray-500 line-through mr-2">
                  ₹{selectedVariant.price}
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  {selectedVariant.discountPercent}% off
                </p>
              </div>
            ) : (
              <p className="text-3xl font-bold text-green-600 mb-1">
                ₹{selectedVariant?.price}
              </p>
            )}

            {/*Variant stock*/}
            <div className="py-1">
              {selectedVariant?.stock && selectedVariant.stock > 0 ? (
                selectedVariant.stock < 10 ? (
                  <p className="text-yellow-600">
                    Only {selectedVariant.stock} left in stock
                  </p>
                ) : (
                  <p className="text-green-600">In stock</p>
                )
              ) : (
                <p className="text-red-600">Out of stock</p>
              )}
            </div>

            <div className="flex space-x-4 mb-6">
              <Button
                className="bg-[#0E8320] hover:bg-[#2ea940] text-white px-8 py-2 rounded-full"
                disabled={selectedVariant?.stock === 0}
              >
                Buy Now
              </Button>
              {cartItem ? (
                <div className="flex items-center border border-[#0E8320] bg-white text-[#0E8320] px-4 py-1 rounded-full">
                  <button
                    className="px-2 text-[#0E8320] hover:text-[#2ea940]"
                    onClick={handleDecreaseQuantity}
                  >
                    -
                  </button>
                  <span className="px-4">{cartItem.quantity}</span>
                  <button
                    className="px-2 text-[#0E8320] hover:text-[#2ea940]"
                    onClick={handleIncreaseQuantity}
                  >
                    +
                  </button>
                </div>
              ) : (
                <Button
                  className="border border-[#0E8320] bg-white hover:bg-white hover:border-[#0E8320a6] hover:text-[#0E8320a6] text-[#0E8320] px-8 py-2 rounded-full"
                  onClick={handleAddToCart}
                  disabled={selectedVariant?.stock === 0}
                >
                  Add to Cart
                </Button>
              )}
            </div>

            {/*<p className="text-xs text-gray-600 mb-4">*/}
            {/*  Estimated delivery time is 3:00PM - 24 min*/}
            {/*</p>*/}

            {/*<span className="mb-4 whitespace-pre-wrap text-sm">*/}
            {/*  {product.description}*/}
            {/*</span>*/}

            {/* <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div> */}

            <button className="text-blue-500 text-sm">
              Report incorrect product information
            </button>
          </div>
        </div>

        {/* Related products */}
        {product.category && (
          <RelatedProducts categoryId={product.category.id} />
        )}
      </main>
    </div>
  );
};

export default ProductPage;
