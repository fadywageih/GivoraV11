import React from 'react';
import { getInputClassName } from '@/utils/productFormUtils';

/**
 * Product Details Form Component
 * Handles basic product information input
 */
const ProductDetailsForm = ({
  formData,
  onChange,
  disabled,
  isEditing,
  productType = 'simple'
}) => {
  const handleProductTypeChange = (e) => {
    // Prevent changing product type on edit
    if (isEditing) return;
    onChange(e);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Product Name */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Product Name *
        </label>
        <input
          required
          name="name"
          value={formData.name}
          onChange={onChange}
          disabled={disabled}
          className={getInputClassName(disabled)}
          placeholder="Enter product name"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Category *
        </label>
        <input
          required
          name="category"
          value={formData.category}
          onChange={onChange}
          disabled={disabled}
          className={getInputClassName(disabled)}
          placeholder="e.g., Tissue, Paper Towels"
        />
      </div>

      {/* SKU */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          SKU *
        </label>
        <input
          required
          name="sku"
          value={formData.sku}
          onChange={onChange}
          disabled={disabled}
          className={getInputClassName(disabled)}
          placeholder="Product SKU"
        />
      </div>

      {/* Product Type */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Product Type *
        </label>
        <select
          name="productType"
          value={formData.productType}
          onChange={handleProductTypeChange}
          disabled={disabled || isEditing}
          className={getInputClassName(disabled || isEditing)}
          title={isEditing ? 'Cannot change product type on edit' : ''}
        >
          <option value="simple">Simple Product</option>
          <option value="variable">Variable Product</option>
        </select>
      </div>

      {/* MOQ */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          MOQ *
        </label>
        <input
          type="number"
          required
          name="moq"
          value={formData.moq}
          onChange={onChange}
          disabled={disabled}
          min="1"
          className={getInputClassName(disabled)}
        />
      </div>

      {/* Retail Price */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Retail Price *
        </label>
        <input
          type="number"
          step="0.01"
          required
          name="retailPrice"
          value={formData.retailPrice}
          onChange={onChange}
          disabled={disabled}
          min="0"
          className={getInputClassName(disabled)}
        />
      </div>

      {/* Wholesale Price */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Wholesale Price *
        </label>
        <input
          type="number"
          step="0.01"
          required
          name="wholesalePrice"
          value={formData.wholesalePrice}
          onChange={onChange}
          disabled={disabled}
          min="0"
          className={getInputClassName(disabled)}
        />
      </div>

      {/* Stock Quantity */}
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Stock Quantity *
        </label>
        <input
          type="number"
          required
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={onChange}
          disabled={disabled}
          min="0"
          className={getInputClassName(disabled)}
        />
      </div>

      {/* Active Status */}
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) => {
              onChange({
                target: {
                  name: 'isActive',
                  value: e.target.checked,
                  type: 'checkbox'
                }
              });
            }}
            disabled={disabled}
            className="w-4 h-4 mr-2 rounded cursor-pointer"
          />
          Active Product
        </label>
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows={4}
          disabled={disabled}
          className={getInputClassName(disabled)}
          placeholder="Enter product description..."
        />
      </div>
    </div>
  );
};

export default ProductDetailsForm;
