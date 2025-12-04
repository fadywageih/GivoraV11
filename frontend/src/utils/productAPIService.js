/**
 * API service methods for product operations
 */

/**
 * Fetch all products
 */
export const fetchProducts = async (adminAPI) => {
  try {
    const res = await adminAPI.getProducts();
    return res.data.products || [];
  } catch (error) {
    console.error('Failed to load products:', error);
    throw error;
  }
};

/**
 * Create new product
 */
export const createProduct = async (adminAPI, productData) => {
  try {
    console.log('🆕 Creating new product');
    const response = await adminAPI.createProduct(productData);
    console.log('✅ Create response:', response);
    return response;
  } catch (error) {
    console.error('❌ Create error:', error);
    throw error;
  }
};

/**
 * Update existing product
 */
export const updateProduct = async (adminAPI, productId, productData) => {
  try {
    console.log('✏️ Updating product:', productId);
    const response = await adminAPI.updateProduct(productId, productData);
    console.log('✅ Update response:', response);
    return response;
  } catch (error) {
    console.error('❌ Update error:', error);
    throw error;
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (adminAPI, productId) => {
  try {
    console.log('🗑️ Deleting product:', productId);
    const response = await adminAPI.deleteProduct(productId);
    console.log('✅ Delete response:', response);
    return response;
  } catch (error) {
    console.error('❌ Delete error:', error);
    throw error;
  }
};

/**
 * Format product data for submission
 */
export const formatProductData = (formData, variants, productImages) => {
  const data = {
    ...formData,
    moq: parseInt(formData.moq),
    retailPrice: parseFloat(formData.retailPrice),
    wholesalePrice: parseFloat(formData.wholesalePrice),
    stockQuantity: parseInt(formData.stockQuantity),
    // Ensure productType is explicitly set
    productType: formData.productType || 'simple'
  };

  // Add images if present
  if (productImages && productImages.length > 0) {
    data.productImages = {
      create: productImages
    };
  }

  // Add variants if variable product
  if (formData.productType === 'variable' && variants && variants.length > 0) {
    data.variants = variants.map(variant => ({
      ...variant,
      variantSku: variant.variantSku || `${formData.sku}-${variant.dimensions || 'default'}`,
      retailPrice: parseFloat(variant.retailPrice),
      wholesalePrice: parseFloat(variant.wholesalePrice),
      stockQuantity: parseInt(variant.stockQuantity)
    }));
  }

  return data;
};
