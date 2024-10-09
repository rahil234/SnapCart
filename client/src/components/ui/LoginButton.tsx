import React from 'react';

interface LoginButtonProps {
  label: string;
  className?: string;
  onLogin: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  onLogin,
  label,
  className,
}) => {
  return (
    <button onClick={onLogin} className={className}>
      {label}
    </button>
  );
};

export default LoginButton;
