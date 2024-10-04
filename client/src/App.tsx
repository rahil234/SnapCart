import React from 'react';
import Home from '@/pages/user/HomePage';
import NavBar from '@/components/user/NavBar';
import Footer from '@/components/user/Footer';

import {
  createBrowserRouter,
  RouterProvider,
  // Route,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <NavBar />
        <div className="pt-[63px]">
          <Home />
        </div>
        <Footer />
      </>
    ),
  }
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
