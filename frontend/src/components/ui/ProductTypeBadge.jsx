import React from 'react';

const ProductTypeBadge = ({ type, variantsCount = 0 }) => {
  if (type === 'variable') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Variable{variantsCount > 0 ? ` (${variantsCount})` : ''}
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Simple
    </span>
  );
};

export default ProductTypeBadge;
