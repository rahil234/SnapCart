import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>About Us</li>
              <li>Contact</li>
              <li>FAQ</li>
            </ul>
          </div>
        </div>
    </footer>
  );
};

export default Footer;
