import React from 'react';

interface InputFieldProps {
  placeholder?: string;
  className?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  className,
  type = 'text',
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={className}
      value={value}
      onChange={handleChange}
      maxLength={1}
           
    />
  );
};

export default InputField;
