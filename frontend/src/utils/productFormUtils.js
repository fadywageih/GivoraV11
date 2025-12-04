/**
 * Form state management for ProductManagement
 */

export const initialFormState = {
  name: '',
  category: '',
  sku: '',
  productType: 'simple',
  moq: 100,
  retailPrice: 0,
  wholesalePrice: 0,
  stockQuantity: 0,
  description: '',
  isActive: true
};

/**
 * Reset form to initial state
 */
export const resetFormState = () => initialFormState;

/**
 * Validate form data
 */
export const validateFormData = (formData, variants, productType) => {
  const errors = [];

  // Required fields
  if (!formData.name?.trim()) {
    errors.push('Product name is required');
  }
  if (!formData.category?.trim()) {
    errors.push('Category is required');
  }
  if (!formData.sku?.trim()) {
    errors.push('SKU is required');
  }

  // Variable product validation
  if (productType === 'variable') {
    if (!variants || variants.length === 0) {
      errors.push('Variable product must have at least one variant');
    }
    if (variants.some(v => !v.variantSku?.trim())) {
      errors.push('All variants must have a SKU');
    }
  }

  return errors;
};

/**
 * Get form field class names
 */
export const getInputClassName = (disabled = false) => {
  return `w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent ${
    disabled ? 'disabled:opacity-50' : ''
  }`;
};
