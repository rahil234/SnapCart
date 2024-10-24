import React, { useState, useRef, useEffect } from 'react';
import { X, Star, ChevronRight } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import userEndpoints from '@/api/userEndpoints';
import { useParams } from 'react-router-dom';
import productEndpoints from '@/api/productEndpoints';

interface Product {
  _id: string;
  name: string;
  category?: { _id: string; name: string };
  subcategory?: { _id: string; name: string };
  price: number;
  quantity: string;
  stock?: number;
  images: string[];
  description?: string;
  tags?: string[];
  reviews?: {
    _id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

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
  const imagrUrl = 'http://localhost:3000/';

  useEffect(() => {
    if (productId) {
      (async () => {
        const response = await userEndpoints.fetchProductById(productId);
        console.log('data', response.data);
        setProduct(response.data);
        setMainImage(response.data.images[0]);
      })();
    }
  }, [productId]);

  useEffect(() => {
    if (product && product.subcategory?._id) {
      (async () => {
        const subcategoryId = product.subcategory?._id;
        if (subcategoryId) {
          const response = await productEndpoints.getRelatedProduct(subcategoryId);
          setRelatedProducts(response.data);
        }
      })();
    }
  }, [product]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${index < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300'
          }`}
      />
    ));
  };

  // const handleVariantChange = (variantName: string, option: string) => {
  //   setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  // };

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

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-4">
          <ol className="list-none p-0 inline-flex">
            <li className="flex items-center">
              <a href="#" className="text-gray-600">
                Home
              </a>
              <ChevronRight size={16} className="mx-2" />
            </li>
            <li className="flex items-center">
              <a href="#" className="text-gray-600">
                {product.category &&
                  product.category.name}
              </a>
              <ChevronRight size={16} className="mx-2" />
            </li>
            <li className="flex items-center">
              {product.subcategory &&
                <span className="text-gray-800">{product.subcategory.name}</span>
              }
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product images */}
          <div className="md:w-1/2">
            <ZoomableImage src={imagrUrl + mainImage} alt={product.name} />
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={imagrUrl + image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-20 h-20 object-cover cursor-pointer border-2 border-transparent hover:border-green-500"
                  onClick={() => setMainImage(image)}
                />
              ))}
            </div>
          </div>

          {/* Product details */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.quantity}</p>
            <div className="flex items-center mb-4">
              <p className="text-3xl font-bold text-green-600 mr-2">
                ₹{product.price}
              </p>
              <p className="text-xl text-gray-500 line-through mr-2">
                ₹{product.price}
              </p>
              <p className="text-sm text-green-600 font-semibold">
                {product.price}% off
              </p>
            </div>

            {/* Product Variants */}
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

            <div className="flex space-x-4 mb-6">
              <button className="bg-green-500 text-white px-6 py-2 rounded-full">
                Buy Now
              </button>
              <button className="border border-green-500 text-green-500 px-6 py-2 rounded-full">
                Add to Cart
              </button>
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
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Related products</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedProducts.map(product => (
              <div key={product._id} className="border rounded-lg p-4">
                <img
                  src={'http://localhost:3000/' + product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-2"
                />
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.quantity}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">₹{product.price}</span>
                  <button className="text-green-500 border border-green-500 px-2 py-1 rounded text-sm">
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

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
