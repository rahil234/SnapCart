import React from 'react';
import { Button } from '@/components/ui/button';

export const MyCart = (): JSX.Element => {
  return (
    <div className="flex flex-col w-[471px] h-[856px] items-start px-0 py-px relative bg-white">
      <div className="flex items-start justify-between p-[15px] relative self-stretch w-full flex-[0_0_auto] bg-white">
        <div className="relative w-fit mt-[-1.00px] [font-family:'Albert_Sans-ExtraBold',Helvetica] font-extrabold text-black text-lg tracking-[0] leading-[25.2px] whitespace-nowrap">
          My Cart
        </div>
      </div>
      <div className="flex flex-col items-center gap-2.5 px-[15px] py-2.5 relative flex-1 self-stretch w-full grow bg-[#f5f7fc]">
        <div className="flex items-center justify-between w-full">
          <span>Nestle Fruits Cereal</span>
          <span>₹120</span>
          <div className="flex items-center">
            <button className="px-2">+</button>
            <span>1</span>
            <button className="px-2">-</button>
            <img
              className="w-5 h-5"
              alt="Remove item"
              src="/path/to/remove-icon.svg"
            />
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <span>Amul Cheese</span>
          <span>₹60</span>
          <div className="flex items-center">
            <button className="px-2">+</button>
            <span>1</span>
            <button className="px-2">-</button>
            <img
              className="w-5 h-5"
              alt="Remove item"
              src="/path/to/remove-icon.svg"
            />
          </div>
        </div>
        <div className="flex items-center justify-between w-full">
          <span>Tropicana Orange Juice</span>
          <span>₹20</span>
          <div className="flex items-center">
            <button className="px-2">+</button>
            <span>1</span>
            <button className="px-2">-</button>
            <img
              className="w-5 h-5"
              alt="Remove item"
              src="/path/to/remove-icon.svg"
            />
          </div>
        </div>
      </div>
      <div className="flex h-[70px] items-center justify-center gap-2.5 p-2.5 relative self-stretch w-full">
        <Button size="md" type="button" variant="primary">
          Order Now
        </Button>
        <Button size="sm" variant="secondary">
          View Cart
        </Button>
      </div>
    </div>
  );
};
