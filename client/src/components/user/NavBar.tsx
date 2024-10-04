import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const NavBar = () => {

  const handleLoginClick = () => {
    
  };

  return (
    <header className="bg-white fixed w-screen shadow-sm py-3 px-6 flex justify-between items-center gap-4 ">
      <h1 className="text-2xl font-bold text-green-600">SnapCart</h1>
      <Input id="username" placeholder='Search for "Milk" ' />
      <div className="flex gap-2">
        <Button variant="ghost" onClick={handleLoginClick}>Login</Button>
        <Button variant="outline">Cart</Button>
      </div>
    </header>
  );
};

export default NavBar;
