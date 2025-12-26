import React from 'react';
import TopBanner from '@/components/user/Banner/TopBanner';
import HomeProducts from '@/components/user/HomeProducts';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-4 mx-auto py-8">
        <TopBanner />
        <HomeProducts />
      </main>
    </div>
  );
}

export default HomePage;
