import React from 'react';
import giftBoxTopOpenBackgroundRemoved1 from '@/assets/gift-box-top-open-background-removed-1.png';
import giftBoxTopOpen2BackgroundRemoved1 from '@/assets/gift-box-top-open2-background-removed-1.png';

export const LoginBg = (): JSX.Element => {
  return (
    <div className="bg-black fixed w-screen p-7 bg-opacity-50 h-screen">
      <div className="relative top-1/2 flex left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[1000px] h-[622px] rounded-3xl overflow-hidden">
        <div className="bg-[#FFDB00] flex-1">
          <div className="absolute w-[561px] h-[382px] top-[239px] left-0 bg-[url(@/assets/3d-rendering-shopping-concept-23-2149877666-1-background-removed-1.png)] bg-cover bg-[50%_50%]">
            <img
              className="absolute w-[186px] h-[180px] top-[202px] left-[316px] object-cover"
              alt="Gift box top"
              src={giftBoxTopOpen2BackgroundRemoved1}
            />
            <div className="absolute w-[459px] h-7 top-[342px] left-[54px]">
              <div className="w-[447px] h-7 bg-[#4b4b4b] rounded-[223.52px/13.78px] blur-[66.61px]" />
            </div>
          </div>
          <div className="absolute w-[328px] h-[158px] top-[30px] left-[18px]">
            <div className="absolute w-[121px] h-[132px] top-[26px] left-0 bg-[url(@/assets/gift-box-top-background-removed-1.png)] bg-cover bg-[50%_50%]" />
            <div className="absolute w-[229px] h-[53px] top-0 left-[99px]">
              <p className="absolute w-[229px] -top-px left-0 [font-family:'Poppins-Bold',Helvetica] font-bold text-transparent text-[45.5px] tracking-[0.45px] leading-[normal] whitespace-nowrap">
                <span className="text-white tracking-[0.21px]">Snap</span>
                <span className="text-[#188c06] tracking-[0.21px]">Cart</span>
                <span className="text-white tracking-[0.21px]">&nbsp;</span>
              </p>
            </div>
          </div>
          <img
            className="absolute w-[153px] h-[94px] top-0 left-[360px] object-cover"
            alt="Gift box top open"
            src={giftBoxTopOpenBackgroundRemoved1}
          />
        </div>
        <div className="flex-1">
          
        </div>
      </div>
    </div>
  );
};
