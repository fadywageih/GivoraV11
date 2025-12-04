import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * Delete Confirmation Modal Component
 */
const DeleteConfirmationModal = ({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 className="text-lg font-bold text-[#0A1F44] mb-2">
          Delete Product?
        </h3>
        <p className="text-gray-600 mb-2">
          {productName && (
            <span>
              <strong>{productName}</strong> will be permanently removed.
            </span>
          )}
          {!productName && <span>This product will be permanently removed.</span>}
        </p>
        <p className="text-gray-600 mb-6 text-sm">
          This action cannot be undone. All associated variants and images will also be deleted.
        </p>
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
