import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * Product List Table Component
 * Displays all products in a table format
 */
const ProductListTable = ({
  products,
  onEdit,
  onDelete,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-left text-gray-700">
                Product
              </th>
              <th className="p-4 font-semibold text-left text-gray-700">
                SKU/Category
              </th>
              <th className="p-4 font-semibold text-left text-gray-700">
                Pricing
              </th>
              <th className="p-4 font-semibold text-left text-gray-700">
                Stock
              </th>
              <th className="p-4 font-semibold text-left text-gray-700">
                Type
              </th>
              <th className="p-4 font-semibold text-left text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Product Table Row Component
 */
const ProductTableRow = ({ product, onEdit, onDelete }) => {
  const primaryImage =
    product.productImages?.[0]?.imageUrl ||
    'https://via.placeholder.com/48x48/cccccc/969696?text=No+Image';
  const additionalImages = product.productImages?.length - 1 || 0;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Product Name & Image */}
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <img
            src={primaryImage}
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
            {additionalImages > 0 && (
              <span className="text-xs text-blue-600">
                +{additionalImages} more image{additionalImages > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* SKU & Category */}
      <td className="p-4">
        <div className="text-sm">
          <p className="font-medium text-gray-900">{product.sku}</p>
          <p className="text-gray-500">{product.category}</p>
        </div>
      </td>

      {/* Pricing */}
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

      {/* Stock */}
      <td className="p-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.stockQuantity > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {product.stockQuantity}
        </span>
      </td>

      {/* Product Type */}
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          product.productType === 'variable' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {product.productType === 'variable' 
            ? `Variable${product.variants?.length > 0 ? ` (${product.variants.length})` : ''}`
            : 'Simple'}
        </span>
      </td>

      {/* Actions */}
      <td className="p-4">
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
            className="hover:bg-blue-50"
            title="Edit product"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => onDelete(product.id)}
            title="Delete product"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ProductListTable;
