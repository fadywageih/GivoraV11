import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { adminAPI } from '@/lib/api';

const VariantForm = ({ variants, onChange, disabled }) => {
    const [expandedVariant, setExpandedVariant] = useState(null);

    const addVariant = () => {
        const newVariant = {
            variantSku: '',
            dimensions: '',
            packetSize: '',
            retailPrice: 0,
            wholesalePrice: 0,
            stockQuantity: 0,
            sortOrder: variants.length,
            isDefault: variants.length === 0,
            isActive: true
        };
        onChange([...variants, newVariant]);
    };

    const removeVariant = (index) => {
        const updated = variants.filter((_, i) => i !== index);
        // Update default if needed
        if (updated.length > 0 && !updated.some(v => v.isDefault)) {
            updated[0].isDefault = true;
        }
        onChange(updated);
    };

    const updateVariant = (index, field, value) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };
        
        // Handle default variant
        if (field === 'isDefault' && value) {
            updated.forEach((v, i) => {
                v.isDefault = i === index;
            });
        }
        
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
                <Button
                    type="button"
                    onClick={addVariant}
                    disabled={disabled}
                    className="bg-green-600 hover:bg-green-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-1" /> Add Variant
                </Button>
            </div>

            <div className="space-y-3">
                {variants.map((variant, index) => (
                    <div key={index} className="border border-gray-300 rounded-lg">
                        <div
                            className="p-4 bg-gray-50 cursor-pointer flex justify-between items-center"
                            onClick={() => setExpandedVariant(expandedVariant === index ? null : index)}
                        >
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {variant.variantSku || `Variant ${index + 1}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Dimensions: {variant.dimensions || 'N/A'} | Stock: {variant.stockQuantity}
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {variant.isDefault && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                        Default
                                    </span>
                                )}
                                {variant.isActive && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                        Active
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeVariant(index);
                                    }}
                                    disabled={disabled}
                                    className="p-1 hover:bg-red-100 rounded transition-colors"
                                >
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                            </div>
                        </div>

                        {expandedVariant === index && (
                            <div className="p-4 border-t border-gray-300 space-y-4 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Variant SKU *
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.variantSku}
                                            onChange={(e) =>
                                                updateVariant(index, 'variantSku', e.target.value)
                                            }
                                            disabled={disabled}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            placeholder="e.g., TIS-0080-V1"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Dimensions
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.dimensions}
                                            onChange={(e) =>
                                                updateVariant(index, 'dimensions', e.target.value)
                                            }
                                            disabled={disabled}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            placeholder="e.g., 20x20x20"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Packet Size
                                        </label>
                                        <input
                                            type="text"
                                            value={variant.packetSize}
                                            onChange={(e) =>
                                                updateVariant(index, 'packetSize', e.target.value)
                                            }
                                            disabled={disabled}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            placeholder="e.g., 1000 units"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Retail Price *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={variant.retailPrice}
                                            onChange={(e) =>
                                                updateVariant(index, 'retailPrice', parseFloat(e.target.value))
                                            }
                                            disabled={disabled}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Wholesale Price *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={variant.wholesalePrice}
                                            onChange={(e) =>
                                                updateVariant(index, 'wholesalePrice', parseFloat(e.target.value))
                                            }
                                            disabled={disabled}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Stock Quantity *
                                        </label>
                                        <input
                                            type="number"
                                            value={variant.stockQuantity}
                                            onChange={(e) =>
                                                updateVariant(index, 'stockQuantity', parseInt(e.target.value))
                                            }
                                            disabled={disabled}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={variant.isDefault}
                                                onChange={(e) =>
                                                    updateVariant(index, 'isDefault', e.target.checked)
                                                }
                                                disabled={disabled}
                                                className="mr-2 cursor-pointer"
                                            />
                                            Set as Default
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={variant.isActive}
                                                onChange={(e) =>
                                                    updateVariant(index, 'isActive', e.target.checked)
                                                }
                                                disabled={disabled}
                                                className="mr-2 cursor-pointer"
                                            />
                                            Active
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {variants.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-600">No variants added yet.</p>
                    <p className="text-sm text-gray-500 mt-1">Click "Add Variant" to create one.</p>
                </div>
            )}
        </div>
    );
};

export default VariantForm;
