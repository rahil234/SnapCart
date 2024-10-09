import React from 'react';

interface LoginButtonProps {
  label: string;
  className?: string;
  onClick?: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onClick: onClick,
  label,
  className,
}) => {
  return (
    <button onClick={onClick} className={className}>
      {label}
    </button>
  );
};

export default LoginButton;
