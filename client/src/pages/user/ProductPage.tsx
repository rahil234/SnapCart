import React, { useState, useRef } from 'react';
import { X, Star, ChevronRight } from 'lucide-react';

const product = {
  id: '1',
  name: 'Muesli Fitness Nutritious Energy, gluten free',
  price: 340,
  discountedPrice: 306,
  discountPercentage: 10,
  weight: '500g',
  images: [
    '/uploads/image1.webp',
    '/uploads/image2.avif',
    '/uploads/image1.webp',
  ],
  tags: ['Gluten free', 'Plant based', 'Vegan', 'Keto'],
  description:
    'Muesli Fitness Nutritious Energy is a popular breakfast cereal that is a healthy and nutritious way to start your day. This delicious cereal is made up of a combination of whole grains, nuts, seeds, and dried fruits.',
  category: 'Breakfast & Cereal',
  subcategory: 'Muesli',
  reviews: [
    {
      id: 1,
      user: 'John D.',
      rating: 5,
      comment: 'Great taste and very nutritious!',
      date: '2023-05-15',
    },
    {
      id: 2,
      user: 'Sarah M.',
      rating: 4,
      comment: 'Good product, but a bit pricey.',
      date: '2023-05-10',
    },
    {
      id: 3,
      user: 'Mike R.',
      rating: 5,
      comment: 'Perfect for my morning routine.',
      date: '2023-05-05',
    },
  ],
  variants: [
    { id: 1, name: 'Size', options: ['500g', '1kg', '2kg'] },
    { id: 2, name: 'Flavor', options: ['Original', 'Chocolate', 'Berry'] },
  ],
};

const relatedProducts = [
  {
    id: '2',
    name: 'DNV Appalam',
    weight: '100 g',
    price: 45,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: '3',
    name: 'DNV Appalam',
    weight: '100 g',
    price: 45,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: '4',
    name: 'DNV Appalam',
    weight: '100 g',
    price: 45,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: '5',
    name: 'DNV Appalam',
    weight: '100 g',
    price: 45,
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: '6',
    name: 'DNV Appalam',
    weight: '100 g',
    price: 45,
    image: '/placeholder.svg?height=200&width=200',
  },
];

const topCategories = [
  {
    name: 'Fresh Fruits',
    icon: '/placeholder.svg?height=50&width=50',
    subcategories: ['Oranges', 'Apples', 'Watermelons', 'Exotic Fruits'],
  },
  {
    name: 'Meat products',
    icon: '/placeholder.svg?height=50&width=50',
    subcategories: ['Poultry', 'Kosher meat', 'Veal and beef', 'Turkey'],
  },
  {
    name: 'Sauces and Ketchup',
    icon: '/placeholder.svg?height=50&width=50',
    subcategories: [
      'Tomato ketchup',
      'Hollandaise sauce',
      'Mayonnaise',
      'Cheese sauce',
    ],
  },
  {
    name: 'Meat products',
    icon: '/placeholder.svg?height=50&width=50',
    subcategories: ['Poultry', 'Kosher meat', 'Veal and beef', 'Turkey'],
  },
  {
    name: 'Fresh Fruits',
    icon: '/placeholder.svg?height=50&width=50',
    subcategories: ['Oranges', 'Apples', 'Watermelons', 'Exotic Fruits'],
  },
  {
    name: 'Meat products',
    icon: '/placeholder.svg?height=50&width=50',
    subcategories: ['Poultry', 'Kosher meat', 'Veal and beef', 'Turkey'],
  },
];

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
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});

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

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({ ...prev, [variantName]: option }));
  };

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
                {product.category}
              </a>
              <ChevronRight size={16} className="mx-2" />
            </li>
            <li className="flex items-center">
              <span className="text-gray-800">{product.subcategory}</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product images */}
          <div className="md:w-1/2">
            <ZoomableImage src={mainImage} alt={product.name} />
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
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
            <p className="text-gray-600 mb-4">{product.weight}</p>
            <div className="flex items-center mb-4">
              <p className="text-3xl font-bold text-green-600 mr-2">
                ₹{product.discountedPrice}
              </p>
              <p className="text-xl text-gray-500 line-through mr-2">
                ₹{product.price}
              </p>
              <p className="text-sm text-green-600 font-semibold">
                {product.discountPercentage}% off
              </p>
            </div>

            {/* Product Variants */}
            {product.variants.map(variant => (
              <div key={variant.id} className="mb-4">
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
                    value={selectedVariants[variant.name] || ''}
                    onChange={e =>
                      handleVariantChange(variant.name, e.target.value)
                    }
                  >
                    {variant.options.map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
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
            <div className="flex flex-wrap gap-2 mb-4">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <button className="text-blue-500 text-sm">
              Report incorrect product information
            </button>
          </div>
        </div>

        {/* Product Reviews */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
          {product.reviews.map(review => (
            <div key={review.id} className="border-b border-gray-200 py-4">
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
              <div key={product.id} className="border rounded-lg p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-2"
                />
                <h4 className="font-semibold">{product.name}</h4>
                <p className="text-sm text-gray-600">{product.weight}</p>
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
        <section className="mt-12">
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
        </section>
      </main>
    </div>
  );
};

export default ProductPage;
