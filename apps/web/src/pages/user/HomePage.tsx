import React from 'react';

import HomeProducts from '@/components/user/HomeProducts';
import TopBanner from '@/components/user/Banner/TopBanner';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-4 sm:px-10 md:px-16 lg:px-20 xl:px-32 2xl:px-40 mx-auto py-8 max-w-[1920px]">
        <TopBanner />
        <HomeProducts />
      </main>
    </div>
  );
}

export default HomePage;
