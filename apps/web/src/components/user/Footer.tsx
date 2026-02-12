import React from 'react';
import { useNavigate } from 'react-router';

const categories = [
  { name: 'Vegetables & Fruits', slug: 'vegetables-fruits' },
  { name: 'Cold Drinks & Juices', slug: 'drinks' },
  { name: 'Bakery & Biscuits', slug: 'bakery-biscuits' },
  { name: 'Dry Fruits, Masala & Oil', slug: 'dry-fruits-masala-oil' },
  { name: 'Paan Corner', slug: 'paan-corner' },
  { name: 'Pharma & Wellness', slug: 'pharma-wellness' },
  { name: 'Ice Creams & Frozen Desserts', slug: 'ice-creams-frozen' },
  { name: 'Beauty & Cosmetics', slug: 'beauty-cosmetics' },
  { name: 'Magazines', slug: 'magazines' },
  { name: 'Dairy & Breakfast', slug: 'dairy-breakfast' },
  { name: 'Instant & Frozen Food', slug: 'instant-frozen-food' },
  { name: 'Sweet Tooth', slug: 'sweet-tooth' },
  { name: 'Sauces & Spreads', slug: 'sauces-spreads' },
  { name: 'Organic & Premium', slug: 'organic-premium' },
  { name: 'Cleaning Essentials', slug: 'cleaning-essentials' },
  { name: 'Personal Care', slug: 'personal-care' },
  { name: 'Books', slug: 'books' },
  { name: 'Print Store', slug: 'print-store' },
  { name: 'Munchies', slug: 'munchies' },
  { name: 'Tea, Coffee & Health Drinks', slug: 'tea-coffee-health' },
  { name: 'Atta, Rice & Dal', slug: 'atta-rice-dal' },
  { name: 'Chicken, Meat & Fish', slug: 'chicken-meat-fish' },
  { name: 'Baby Care', slug: 'baby-care' },
  { name: 'Home & Office', slug: 'home-office' },
  { name: 'Pet Care', slug: 'pet-care' },
  { name: 'Toys & Games', slug: 'toys-games' },
  { name: 'Navratri Store', slug: 'navratri-store' },
];

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (slug: string) => {
    navigate(`/category/${slug}`);
  };

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="px-4 sm:px-10 md:px-16 lg:px-20 xl:px-32 2xl:px-40 mx-auto max-w-[1920px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2 text-sm mb-4">
              {[
                'Partner',
                'Franchise',
                'Seller',
                'Warehouse',
                'Deliver',
                'Resources',
              ].map((link, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-gray-300 transition-colors"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category, index) => (
                <li key={index} className="text-sm">
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className="text-left hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-2 mt-10 text-sm">
              {categories.slice(6, 12).map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className="text-left hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-2 mt-10 text-sm">
              {categories.slice(12, 18).map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleCategoryClick(category.slug)}
                    className="text-left hover:text-gray-300 transition-colors cursor-pointer"
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>© 2024–2026 SnapCart</p>
          {/* <div className="flex justify-center space-x-4 mt-4">
            <span>Download App</span>
            <img
              src="/placeholder.svg?height=30&width=100"
              alt="App Store"
              className="h-8"
            />
            <img
              src="/placeholder.svg?height=30&width=100"
              alt="Google Play"
              className="h-8"
            />
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
