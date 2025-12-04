import React from 'react';
import { Upload, X } from 'lucide-react';

/**
 * Image Upload Section Component
 * Handles product image uploads with previews
 */
const ImageUploadSection = ({
  imagePreviews,
  onImageSelect,
  onRemoveImage,
  uploading,
  maxImages = 4
}) => {
  const canAddMore = imagePreviews.length < maxImages;

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
      <label className="block text-sm font-medium mb-4 text-gray-700">
        Product Images ({imagePreviews.length}/{maxImages})
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
                  onClick={() => onRemoveImage(index)}
                  disabled={uploading}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all disabled:opacity-50"
                  title="Remove image"
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
          onChange={onImageSelect}
          className="hidden"
          id="image-upload"
          disabled={uploading || !canAddMore}
          multiple
        />
        <label
          htmlFor="image-upload"
          className={`cursor-pointer inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors ${
            uploading || !canAddMore ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="w-4 h-4 mr-2" />
          {imagePreviews.length >= maxImages
            ? `Maximum ${maxImages} Images`
            : 'Upload Images'}
        </label>
        <p className="text-xs text-gray-500 mt-2">
          PNG, JPG, WebP up to 10MB each. Maximum {maxImages} images.
        </p>
      </div>
    </div>
  );
};

export default ImageUploadSection;
