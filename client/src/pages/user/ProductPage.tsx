import React, { useState, useRef, useEffect, useContext } from 'react';
import { useParams, ScrollRestoration, NavLink, Link } from 'react-router';
import { X, Star, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import productEndpoints from '@/api/productEndpoints';
import ProductCard from '@/components/user/ProductCard';
import { Product } from 'shared/types';
import { ImportMeta } from 'shared/types';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import {
  addItemToCart,
  CartState,
  updateQuantity,
} from '@/features/cart/cartSlice';
import { useAppDispatch } from '@/app/store';
import { AuthState } from '@/features/auth/authSlice';
import { UIContext } from '@/context/UIContext';
import { toast } from 'sonner';

const imageUrl =
  (import.meta as unknown as ImportMeta).env.VITE_BUCKET_URL + '/';

const ZoomableImage: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const { left, top, width, height } =
        imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setPosition({ x, y });
    }
  };

  return (
    <>
      <img
        src={src}
        alt={alt}
        className="w-full h-96 object-contain mb-4 cursor-zoom-in"
        onClick={() => setIsZoomed(true)}
      />
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full h-full overflow-hidden cursor-zoom-out"
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imageRef}
              src={src}
              alt={alt}
              className="absolute w-[200%] h-[200%] max-w-none"
              style={{
                top: `${-position.y}%`,
                left: `${-position.x}%`,
                transform: 'scale(1)',
                transformOrigin: `${position.x}% ${position.y}%`,
              }}
            />
          </div>
          <button
            className="absolute top-4 right-4 text-black"
            onClick={() => setIsZoomed(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </>
  );
};

const ProductPage: React.FC = () => {
  // const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const { productId } = useParams<{ productId: string }>();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [variants] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [cartQuantity, setCartQuantity] = useState<number>(0);

  const { showLoginOverlay } = useContext(UIContext);
  const { user } = useSelector((state: { auth: AuthState }) => state.auth);

  const { cartData } = useSelector((state: { cart: CartState }) => state.cart);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (productId) {
      (async () => {
        const response = await productEndpoints.fetchProductById(productId);
        setProduct(response.data);
        setMainImage(response.data.images[0]);
      })();
    }
  }, [productId]);

  useEffect(() => {
    if (product)
      setCartQuantity(
        cartData?.items.find(item => item._id === product._id)?.quantity || 0
      );
  }, [product, cartData]);

  useEffect(() => {
    if (product && product.subcategory?._id) {
      (async () => {
        const response = await productEndpoints.getRelatedProduct(product._id);
        setRelatedProducts(response.data);
      })();
    }
  }, [product]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculateDiscount = (originalPrice: number, discount: number) => {
    return Math.floor(originalPrice - (originalPrice * discount) / 100);
  };

  if (!product) {
    return (
      <div className="p-8">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      showLoginOverlay();
      return;
    }
    dispatch(addItemToCart({ _id: product!._id, product: product! }));
  };

  const handleIncreaseQuantity = () => {
    if (cartQuantity >= product.stock) {
      toast.error('Out of stock');
      return;
    } else if (cartQuantity >= 10) {
      toast.error('You can add only 10 items at a time');
      return;
    }
    dispatch(updateQuantity({ _id: product!._id, quantity: cartQuantity + 1 }));
  };

  const handleDecreaseQuantity = () => {
    dispatch(updateQuantity({ _id: product!._id, quantity: cartQuantity - 1 }));
  };

  // const handleVariantChange = (variantName: string, option: string) => {
  //   setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  // };

  return (
    <div className="min-h-screen flex flex-col">
      {/*<ScrollRestoration />*/}
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
                to={`/category/${product.category.name}`}
                className="text-gray-600"
              >
                {product.category && product.category.name}
              </NavLink>
              <ChevronRight size={16} className="mx-2" />
            </li>
            <li className="flex items-center">
              {product.subcategory && (
                <span className="text-gray-800">
                  {product.subcategory.name}
                </span>
              )}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product images */}
          <div className="md:w-1/2">
            <ZoomableImage src={imageUrl + mainImage} alt={product.name} />
            <div className="flex space-x-2 flex-wrap">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={imageUrl + image}
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
                'variants' in product &&
                product.variants.map((variant, index) => (
                  <Link
                    key={index}
                    replace
                    to={`/product/${variant.id}`}
                    className={`mt-10 mb-4 border-2 w-fit p-1 px-4 ${variant.id === productId && 'border-green-500'} rounded-lg flex flex-col`}
                  >
                    <span className="text-green-700">{`₹${variant.price}`}</span>
                    <span>{variant.variantName}</span>
                  </Link>
                ))}
            </div>

            {/* Product price */}
            {product.discount ? (
              <div className="flex items-center mb-1">
                <p className="text-3xl font-bold text-green-600 mr-2">
                  ₹{calculateDiscount(product.price, product.discount)}
                </p>
                <p className="text-xl text-gray-500 line-through mr-2">
                  ₹{product.price}
                </p>
                <p className="text-sm text-green-600 font-semibold">
                  {product.discount}% off
                </p>
              </div>
            ) : (
              <p className="text-3xl font-bold text-green-600 mb-1">
                ₹{product.price}
              </p>
            )}

            {/* Product stock */}
            <div className="py-1">
              {product.stock && product.stock > 0 ? (
                product.stock < 10 ? (
                  <p className="text-yellow-600">
                    Only {product.stock} left in stock
                  </p>
                ) : (
                  <p className="text-green-600">In stock</p>
                )
              ) : (
                <p className="text-red-600">Out of stock</p>
              )}
            </div>

            {/* Product Variants */}
            <div className="flex">
              {variants.map(variant => (
                <div key={variant._id} className="mb-4">
                  <label
                    htmlFor={variant.name}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {variant.name}
                  </label>
                  <div className="">
                    <select
                      id={variant.name}
                      name={variant.name}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                      // value={selectedVariants[variant.name] || ''}
                      // onChange={e =>
                      //   handleVariantChange(variant.name, e.target.value)
                      // }
                    >
                      {/* {variant.options.map(option => (
                      <option key={option} value={option}>
                      {option}
                      </option>
                      ))} */}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mb-6">
              <Button
                className="bg-[#0E8320] hover:bg-[#2ea940] text-white px-8 py-2 rounded-full"
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              {cartQuantity ? (
                <div className="flex items-center border border-[#0E8320] bg-white text-[#0E8320] px-4 py-1 rounded-full">
                  <button
                    className="px-2 text-[#0E8320] hover:text-[#2ea940]"
                    onClick={handleDecreaseQuantity}
                  >
                    -
                  </button>
                  <span className="px-4">{cartQuantity}</span>
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
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Estimated delivery time is 3:00PM - 24 min
            </p>
            <p className="mb-4">{product.description}</p>
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

        {/* Product Reviews */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          {product.reviews?.length &&
            product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 py-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">{renderStars(review.rating)}</div>
                  <p className="font-semibold">{review.user}</p>
                </div>
                <p className="text-gray-700 mb-1">{review.comment}</p>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
            ))}
        </section>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <h3 className="text-2xl text-center font-semibold mb-4">
              You may also like
            </h3>
            <div className="flex gap-4">
              {relatedProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* Top categories */}
        {/* <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Top Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCategories.map((category, index) => (
              <div key={index} className="text-center">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-20 h-20 mx-auto mb-2 rounded-full"
                />
                <h4 className="font-semibold mb-1">{category.name}</h4>
                <ul className="text-sm text-gray-600">
                  {category.subcategories.map((sub, subIndex) => (
                    <li key={subIndex}>{sub}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section> */}
      </main>
    </div>
  );
};

export default ProductPage;
