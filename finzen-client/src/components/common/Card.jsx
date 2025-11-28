import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;