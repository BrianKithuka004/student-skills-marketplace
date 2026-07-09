import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ 
  name, 
  value, 
  onChange, 
  placeholder, 
  className = '',
  showMatch = false,
  matchStatus = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        className={`input-field pl-12 pr-12 ${className}`}
        placeholder={placeholder}
        minLength="6"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
      >
        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
      </button>
    </div>
  );
};

export default PasswordInput;