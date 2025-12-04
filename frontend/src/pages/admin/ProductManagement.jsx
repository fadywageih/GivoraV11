import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Import utility functions
import {
  initialFormState,
  validateFormData
} from '@/utils/productFormUtils';
import {
  validateImageFiles,
  exceedsImageLimit,
  createImagePreview,
  uploadImagesToServer
} from '@/utils/imageHandlingUtils';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  formatProductData
} from '@/utils/productAPIService';

// Import components
import ProductFormModal from '@/components/admin/ProductFormModal';
import ProductListTable from '@/components/admin/ProductListTable';
import DeleteConfirmationModal from '@/components/admin/DeleteConfirmationModal';
import ImageUploadSection from '@/components/admin/ImageUploadSection';
import ProductDetailsForm from '@/components/admin/ProductDetailsForm';
import VariantForm from '@/components/admin/VariantForm';

/**
 * Product Management Page
 * Main component for managing products (create, read, update, delete)
 */
const ProductManagement = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [variants, setVariants] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  /**
   * Load all products on mount
   */
  useEffect(() => {
    loadProductsData();
  }, []);

  /**
   * Fetch products from API
   */
  const loadProductsData = useCallback(async () => {
    setLoading(true);
    try {
      const loadedProducts = await fetchProducts(adminAPI);
      setProducts(loadedProducts);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);


  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setVariants([]);
    setSelectedImages([]);
    setImagePreviews([]);
    setCurrentProduct(null);
    setUploading(false);
  }, []);

  /**
   * Open form for creating new product
   */
  const handleAddNew = useCallback(() => {
    resetForm();
    setIsEditing(true);
  }, [resetForm]);

  /**
   * Open form for editing existing product
   */
  const handleEdit = useCallback((product) => {
    setFormData({
      name: product.name || '',
      category: product.category || '',
      sku: product.sku || '',
      productType: product.productType || 'simple',
      moq: product.moq || 100,
      retailPrice: product.retailPrice || 0,
      wholesalePrice: product.wholesalePrice || 0,
      stockQuantity: product.stockQuantity || 0,
      description: product.description || '',
      isActive: product.isActive !== undefined ? product.isActive : true
    });

    setVariants(product.variants || []);
    setCurrentProduct(product);

    // Set existing images as previews
    setImagePreviews(
      product.productImages?.map((img) => ({
        url: img.imageUrl,
        id: img.id,
        isExisting: true
      })) || []
    );

    setSelectedImages([]);
    setIsEditing(true);
  }, []);

  /**
   * Close form
   */
  const handleCancel = useCallback(() => {
    setIsEditing(false);
    resetForm();
  }, [resetForm]);

  /**
   * Handle form field changes
   */
  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const processedValue =
      type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  }, []);

  /**
   * Handle image file selection
   */
  const handleImageSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);

      if (files.length === 0) return;

      // Validate files
      const validationErrors = validateImageFiles(files);
      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          toast({
            title: 'Invalid File',
            description: error,
            variant: 'destructive'
          });
        });
        return;
      }

      // Check limit
      if (exceedsImageLimit(selectedImages.length, files.length)) {
        toast({
          title: 'Too many images',
          description: 'You can upload up to 4 images per product',
          variant: 'destructive'
        });
        return;
      }

      // Add new files
      setSelectedImages((prev) => [...prev, ...files]);

      // Create previews
      Promise.all(files.map(createImagePreview))
        .then((previews) => {
          setImagePreviews((prev) => [...prev, ...previews]);
        })
        .catch((error) => {
          console.error('Failed to create previews:', error);
          toast({
            title: 'Error',
            description: 'Failed to process images',
            variant: 'destructive'
          });
        });
    },
    [selectedImages, toast]
  );

  /**
   * Remove image from preview
   */
  const handleRemoveImage = useCallback((index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setUploading(true);

      try {
        // Validate form
        const validationErrors = validateFormData(
          formData,
          variants,
          formData.productType
        );
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(', '));
        }

        console.log('🚀 Starting product submission...');
        let productImages = [];

        // Upload new images
        if (selectedImages.length > 0) {
          console.log('📤 Uploading images...');
          productImages = await uploadImagesToServer(
            selectedImages,
            adminAPI.uploadProductImage
          );
          console.log('✅ Uploaded images:', productImages);
        }

        // Format product data
        const productData = formatProductData(
          formData,
          variants,
          productImages
        );
        console.log('📦 Final product data to send:', productData);

        // Create or update
        if (currentProduct) {
          await updateProduct(adminAPI, currentProduct.id, productData);
          toast({
            title: 'Updated',
            description: 'Product updated successfully.'
          });
        } else {
          await createProduct(adminAPI, productData);
          toast({
            title: 'Created',
            description: 'New product added successfully.'
          });
        }

        // Refresh products list
        setIsEditing(false);
        await loadProductsData();
      } catch (error) {
        console.error('❌ Submit error:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to save product',
          variant: 'destructive'
        });
      } finally {
        setUploading(false);
      }
    },
    [formData, variants, selectedImages, currentProduct, toast, loadProductsData]
  );

  /**
   * Handle product deletion
   */
  const handleDelete = useCallback(
    async (id) => {
      setUploading(true);
      try {
        await deleteProduct(adminAPI, id);
        setShowDeleteConfirm(null);
        toast({
          title: 'Deleted',
          description: 'Product removed successfully.'
        });
        await loadProductsData();
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive'
        });
      } finally {
        setUploading(false);
      }
    },
    [toast, loadProductsData]
  );

  /**
   * Handle delete confirmation
   */
  const handleDeleteConfirm = useCallback(() => {
    if (showDeleteConfirm) {
      handleDelete(showDeleteConfirm);
    }
  }, [showDeleteConfirm, handleDelete]);


  return (
    <>
      <Helmet>
        <title>Product Management - Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Empty State */}
        {products.length === 0 && !loading && (
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
        )}

        {/* Products Table */}
        {(products.length > 0 || loading) && (
          <ProductListTable
            products={products}
            onEdit={handleEdit}
            onDelete={setShowDeleteConfirm}
            loading={loading}
          />
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isEditing}
        isEditing={!!currentProduct}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        isLoading={uploading}
      >
        <ImageUploadSection
          imagePreviews={imagePreviews}
          onImageSelect={handleImageSelect}
          onRemoveImage={handleRemoveImage}
          uploading={uploading}
        />

        <ProductDetailsForm
          formData={formData}
          onChange={handleFormChange}
          disabled={uploading}
          isEditing={!!currentProduct}
          productType={formData.productType}
        />

        {/* Variable Product Section */}
        {formData.productType === 'variable' && (
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <VariantForm
              variants={variants}
              onChange={setVariants}
              disabled={uploading}
            />
          </div>
        )}
      </ProductFormModal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={!!showDeleteConfirm}
        productName={
          products.find((p) => p.id === showDeleteConfirm)?.name || ''
        }
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(null)}
        isLoading={uploading}
      />
    </>
  );
};

export default ProductManagement;