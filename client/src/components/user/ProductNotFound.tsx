import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';


function ProductNotFoundPage() {

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <ShoppingBag className="mx-auto h-16 w-16 text-blue-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, the product you are looking for does not exist or has been
            removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Go back to Home
          </Link>
        </div>

        {/*<div className="bg-white rounded-lg shadow-md p-6">*/}
        {/*  <h2 className="text-2xl font-semibold text-gray-800 mb-6">*/}
        {/*    Available Products*/}
        {/*  </h2>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}

export default ProductNotFoundPage;
