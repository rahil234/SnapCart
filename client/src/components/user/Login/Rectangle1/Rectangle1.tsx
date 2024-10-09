import React from "react";

interface Props {
  className: any;
}

export const Rectangle1 = ({ className }: Props): JSX.Element => {
  return (
    <svg
      className={`${className}`}
      fill="none"
      height="622"
      viewBox="0 0 1000 622"
      width="1000"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 34.4407C0 15.4196 15.4197 0 34.4408 0H965.559C984.58 0 1000 15.4197 1000 34.4408V587.559C1000 606.58 984.58 622 965.559 622H34.4408C15.4197 622 0 606.58 0 587.559V34.4407Z"
        fill="url(#paint0_linear_0_16)"
      />
      <defs>
        <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_0_16" x1="480.014" x2="500" y1="622" y2="622">
          <stop offset="0.5" stopColor="#FFDD2D" />
          <stop offset="0.5" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
};
