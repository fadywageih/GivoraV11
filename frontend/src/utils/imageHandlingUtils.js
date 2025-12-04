/**
 * Image handling utilities for products
 */

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_IMAGES = 4;

/**
 * Validate image files
 */
export const validateImageFiles = (files) => {
  const errors = [];

  // Check for invalid file types
  const invalidFiles = files.filter(file => !VALID_IMAGE_TYPES.includes(file.type));
  if (invalidFiles.length > 0) {
    errors.push('Invalid file type. Only JPEG, PNG, or WebP allowed');
  }

  // Check for large files
  const largeFiles = files.filter(file => file.size > MAX_FILE_SIZE);
  if (largeFiles.length > 0) {
    errors.push('File too large. Maximum 10MB per image');
  }

  return errors;
};

/**
 * Check if adding files exceeds limit
 */
export const exceedsImageLimit = (currentCount, newCount) => {
  return currentCount + newCount > MAX_IMAGES;
};

/**
 * Create image preview from file
 */
export const createImagePreview = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        url: reader.result,
        file: file,
        isExisting: false
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload single image via API
 */
export const uploadImageToServer = async (file, uploadFn, index) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const res = await uploadFn(formData);

    if (!res || !res.data) {
      throw new Error('Invalid response from server');
    }

    return {
      imageUrl: res.data.imageUrl,
      cloudinaryId: res.data.cloudinaryId || '',
      sortOrder: index,
      isPrimary: index === 0
    };
  } catch (error) {
    console.error('❌ Image upload failed:', error);
    throw error;
  }
};

/**
 * Upload multiple images
 */
export const uploadImagesToServer = async (files, uploadFn) => {
  const uploadPromises = files.map((file, index) =>
    uploadImageToServer(file, uploadFn, index)
  );

  const uploadResults = await Promise.allSettled(uploadPromises);

  return uploadResults
    .filter(result => result.status === 'fulfilled')
    .map((result, index) => ({
      ...result.value,
      sortOrder: index,
      isPrimary: index === 0
    }));
};

/**
 * Format images for API request
 */
export const formatImagesForAPI = (images) => {
  if (images.length === 0) return undefined;

  return {
    create: images
  };
};
