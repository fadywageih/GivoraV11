import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Upload, X, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const initialForm = {
    name: '', 
    category: '', 
    sku: '', 
    moq: 100,
    retailPrice: 0, 
    wholesalePrice: 0, 
    stockQuantity: 0,
    description: '',
  };
  
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await adminAPI.getProducts();
      setProducts(res.data.products);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive"
      });
    }
  };

  const handleAddNew = () => {
    setFormData(initialForm);
    setCurrentProduct(null);
    setSelectedImages([]);
    setImagePreviews([]);
    setIsEditing(true);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      category: product.category || '',
      sku: product.sku || '',
      moq: product.moq || 100,
      retailPrice: product.retailPrice || 0,
      wholesalePrice: product.wholesalePrice || 0,
      stockQuantity: product.stockQuantity || 0,
      description: product.description || '',
    });
    setCurrentProduct(product);
    setSelectedImages([]);
    // Set existing images as previews
    setImagePreviews(product.productImages?.map(img => ({
      url: img.imageUrl,
      id: img.id,
      isExisting: true
    })) || []);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteProduct(id);
      await loadProducts();
      setShowDeleteConfirm(null);
      toast({ 
        title: "Deleted", 
        description: "Product removed successfully." 
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate files
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid file type",
        description: "Please select only JPEG, PNG, or WebP images",
        variant: "destructive"
      });
      return;
    }

    // Validate file sizes (10MB each)
    const largeFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (largeFiles.length > 0) {
      toast({
        title: "File too large",
        description: "Please select images smaller than 10MB each",
        variant: "destructive"
      });
      return;
    }

    // Limit to 4 images
    if (selectedImages.length + files.length > 4) {
      toast({
        title: "Too many images",
        description: "You can upload up to 4 images per product",
        variant: "destructive"
      });
      return;
    }

    setSelectedImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, {
          url: reader.result,
          file: file,
          isExisting: false
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (file) => {
    console.log('🖼️ Uploading image:', file.name);
    
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const res = await adminAPI.uploadProductImage(formDataUpload);
      console.log('✅ Image upload response:', res);

      if (res && res.data) {
        return {
          imageUrl: res.data.imageUrl,
          cloudinaryId: res.data.cloudinaryId || '',
          sortOrder: selectedImages.indexOf(file),
          isPrimary: selectedImages.indexOf(file) === 0 // First image is primary
        };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Image upload failed:', error);
      throw error;
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setUploading(true);

  try {
    // Validate required fields
    if (!formData.name || !formData.category || !formData.sku) {
      throw new Error('Please fill in all required fields');
    }

    console.log('🚀 Starting product submission...');
    console.log('📝 Form data:', formData);
    console.log('🖼️ Selected images:', selectedImages.length);

    let productImages = [];

    // Upload new images
    if (selectedImages.length > 0) {
      console.log('📤 Uploading images...');
      
      const uploadPromises = selectedImages.map((file, index) => handleImageUpload(file, index));
      const uploadResults = await Promise.allSettled(uploadPromises);
      
      productImages = uploadResults
        .filter(result => result.status === 'fulfilled')
        .map((result, index) => ({
          ...result.value,
          sortOrder: index,
          isPrimary: index === 0 // First image is primary
        }));

      console.log('✅ Uploaded images:', productImages);
    }

    // Prepare product data
    const productData = {
      ...formData,
      ...(productImages.length > 0 && {
        productImages: {
          create: productImages
        }
      })
    };

    console.log('📦 Final product data to send:', productData);

    if (currentProduct) {
      console.log('✏️ Updating product:', currentProduct.id);
      const response = await adminAPI.updateProduct(currentProduct.id, productData);
      console.log('✅ Update response:', response);
      toast({ 
        title: "Updated", 
        description: "Product updated successfully." 
      });
    } else {
      console.log('🆕 Creating new product');
      const response = await adminAPI.createProduct(productData);
      console.log('✅ Create response:', response);
      toast({ 
        title: "Created", 
        description: "New product added successfully." 
      });
    }
    
    console.log('✅ Product saved successfully');
    setIsEditing(false);
    await loadProducts();
  } catch (error) {
    console.error('❌ Submit error:', error);
    console.error('❌ Error response:', error.response || error.message);
    toast({ 
      title: "Error", 
      description: error.message || "Failed to save product", 
      variant: "destructive" 
    });
  } finally {
    setUploading(false);
  }
};

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? 
      (value === '' ? '' : parseFloat(value)) : 
      value;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: processedValue 
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImages([]);
    setImagePreviews([]);
    setUploading(false);
  };

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto">
        <Helmet>
          <title>{currentProduct ? 'Edit Product' : 'Add Product'} - Admin</title>
        </Helmet>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#0A1F44]">
              {currentProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Multiple Images Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
              <label className="block text-sm font-medium mb-4 text-gray-700">
                Product Images ({imagePreviews.length}/4)
              </label>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={preview.url} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Button */}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading || imagePreviews.length >= 4}
                  multiple
                />
                <label
                  htmlFor="image-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors ${
                    uploading || imagePreviews.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {imagePreviews.length >= 4 ? 'Maximum 4 Images' : 'Upload Images'}
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  PNG, JPG, WebP up to 10MB each. Maximum 4 images.
                </p>
              </div>
            </div>

            {/* Product Details - نفس الكود السابق */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Product Name *
                </label>
                <input 
                  required 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange}
                  disabled={uploading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Category *
                </label>
                <input 
                  required 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  disabled={uploading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                  placeholder="e.g., Tissue, Paper Towels"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  SKU *
                </label>
                <input 
                  required 
                  name="sku" 
                  value={formData.sku} 
                  onChange={handleChange}
                  disabled={uploading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                  placeholder="Product SKU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  MOQ *
                </label>
                <input 
                  type="number" 
                  required 
                  name="moq" 
                  value={formData.moq} 
                  onChange={handleChange}
                  disabled={uploading}
                  min="1"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                />
              </div>

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
                  onChange={handleChange}
                  disabled={uploading}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                />
              </div>

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
                  onChange={handleChange}
                  disabled={uploading}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Stock Quantity *
                </label>
                <input 
                  type="number" 
                  required 
                  name="stockQuantity" 
                  value={formData.stockQuantity} 
                  onChange={handleChange}
                  disabled={uploading}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                disabled={uploading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:border-transparent disabled:opacity-50"
                placeholder="Enter product description..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {selectedImages.length > 0 ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  currentProduct ? 'Update Product' : 'Create Product'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // باقي الكود بنفس الطريقة
  return (
    <>
      <Helmet>
        <title>Products - Admin</title>
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0A1F44] mb-4 md:mb-0">
            Product Management
          </h1>
          <Button 
            onClick={handleAddNew} 
            className="bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90"
          >
            <Plus className="w-4 h-4 mr-2" /> 
            Add Product
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No products found.</p>
            <Button 
              onClick={handleAddNew} 
              className="mt-4 bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90"
            >
              <Plus className="w-4 h-4 mr-2" /> 
              Add Your First Product
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 font-semibold text-left text-gray-700">Product</th>
                    <th className="p-4 font-semibold text-left text-gray-700">SKU/Category</th>
                    <th className="p-4 font-semibold text-left text-gray-700">Pricing</th>
                    <th className="p-4 font-semibold text-left text-gray-700">Stock</th>
                    <th className="p-4 font-semibold text-left text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <img 
  src={product.productImages?.[0]?.imageUrl || 'https://via.placeholder.com/48x48/cccccc/969696?text=No+Image'} 
  alt={product.name} 
  className="w-12 h-12 rounded object-cover bg-gray-200" 
/>
                          <div>
                            <span className="font-medium text-gray-900 block">
                              {product.name}
                            </span>
                            {product.description && (
                              <span className="text-sm text-gray-500 truncate max-w-xs block">
                                {product.description}
                              </span>
                            )}
                            {product.productImages && product.productImages.length > 1 && (
                              <span className="text-xs text-blue-600">
                                +{product.productImages.length - 1} more images
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="font-medium text-gray-900">{product.sku}</p>
                          <p className="text-gray-500">{product.category}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            Retail: ${parseFloat(product.retailPrice).toFixed(2)}
                          </p>
                          <p className="text-gray-500">
                            Wholesale: ${parseFloat(product.wholesalePrice).toFixed(2)}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stockQuantity > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(product)}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => setShowDeleteConfirm(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-bold text-[#0A1F44] mb-2">
                Delete Product?
              </h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. The product will be permanently removed.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white" 
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductManagement;