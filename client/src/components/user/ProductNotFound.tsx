import React from 'react';
import { Link } from 'react-router';

function ProductNotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Product Not Found</h1>
      <p>Sorry, the product you are looking for does not exist.</p>
      <Link to="/" style={{ color: 'blue', textDecoration: 'underline' }}>
        Go back to Home
      </Link>
    </div>
  );
}

export default ProductNotFoundPage;
