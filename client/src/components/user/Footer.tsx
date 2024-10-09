import React from 'react';

const categories = [
  'Vegetables & Fruits',
  'Cold Drinks & Juices',
  'Bakery & Biscuits',
  'Dry Fruits, Masala & Oil',
  'Paan Corner',
  'Pharma & Wellness',
  'Ice Creams & Frozen Desserts',
  'Beauty & Cosmetics',
  'Magazines',
  'Dairy & Breakfast',
  'Instant & Frozen Food',
  'Sweet Tooth',
  'Sauces & Spreads',
  'Organic & Premium',
  'Cleaning Essentials',
  'Personal Care',
  'Books',
  'Print Store',
  'Munchies',
  'Tea, Coffee & Health Drinks',
  'Atta, Rice & Dal',
  'Chicken, Meat & Fish',
  'Baby Care',
  'Home & Office',
  'Pet Care',
  'Toys & Games',
  'Navratri Store',
];

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold mb-4">Useful Links</h4>
            <ul className="space-y-2">
              {[
                'Partner',
                'Franchise',
                'Seller',
                'Warehouse',
                'Deliver',
                'Resources',
              ].map((link, index) => (
                <li key={index}>{link}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-2 mt-10">
              {categories.slice(6, 12).map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-2 mt-10">
              {categories.slice(12, 18).map((category, index) => (
                <li key={index}>{category}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          <p>© SnapCart Domestic Private Limited 2018-2024</p>
          <div className="flex justify-center space-x-4 mt-4">
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
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
