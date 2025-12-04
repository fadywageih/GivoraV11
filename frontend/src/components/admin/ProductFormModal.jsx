import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

/**
 * Product Form Modal Component
 * Wraps the product form in a modal dialog
 */
const ProductFormModal = ({
  isOpen,
  isEditing,
  children,
  onCancel,
  onSubmit,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4">
        <Helmet>
          <title>{isEditing ? 'Edit Product' : 'Add Product'} - Admin</title>
        </Helmet>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0A1F44]">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h2>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isLoading ? 'Saving...' : 'Saving...'}
                </>
              ) : isEditing ? (
                'Update Product'
              ) : (
                'Create Product'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
