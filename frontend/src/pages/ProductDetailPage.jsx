import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShoppingCart, ArrowLeft, Package, Zap, Check, Minus, Plus, Tag, Grid3x3, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { productsAPI } from '@/lib/api';
import ProductTypeBadge from '@/components/ui/ProductTypeBadge';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, getDiscountRate, addToCart, isUserWholesale } = useAuth();
  const { toast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        const productData = response.data.product;
        console.log('Product data:', productData);
        console.log('Variants:', productData.variants);
        
        setProduct(productData);
        
        if (productData.productType === 'variable' && productData.variants?.length > 0) {
          // Find the default variant or use first one
          const defaultVariant = productData.variants.find(v => v.isDefault) || productData.variants[0];
          setSelectedVariant(defaultVariant);
          setQuantity(Math.max(1, defaultVariant.moq || productData.moq || 1));
        } else {
          setQuantity(Math.max(1, productData.moq || 1));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        });
        navigate('/shop');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id, navigate, toast]);

  const isWholesale = isUserWholesale();
  const volumeDiscount = getDiscountRate();

  const calculatePrice = (variant = null) => {
    if (!product) return 0;
    
    let price;
    
    if (variant) {
      price = isWholesale ? variant.wholesalePrice : variant.retailPrice;
    } else if (product.productType === 'variable' && selectedVariant) {
      price = isWholesale ? selectedVariant.wholesalePrice : selectedVariant.retailPrice;
    } else {
      price = isWholesale ? product.wholesalePrice : product.retailPrice;
    }

    if (isWholesale && volumeDiscount > 0) {
      price = price * (1 - volumeDiscount);
    }

    return price;
  };

  const getMinQty = () => {
    if (!product) return 1;
    const baseMoq = product.moq || 1;
    return isWholesale ? Math.max(3, baseMoq) : Math.max(1, baseMoq);
  };

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    const minQty = getMinQty();
    const finalQuantity = Math.max(quantity, minQty);

    if (isWholesale && quantity < minQty) {
      toast({
        title: "Minimum Quantity Required",
        description: `Wholesale customers must order at least ${minQty} units.`,
        variant: "destructive"
      });
      setQuantity(minQty);
      return;
    }

    // Add to cart with variant ID if applicable
    const variantId = selectedVariant?.id || null;
    addToCart(product, finalQuantity, variantId);

    toast({
      title: "Added to Cart",
      description: `${finalQuantity} x ${selectedVariant ? selectedVariant.variantSku : product.name} has been added to your cart`,
    });
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    const minQuantity = getMinQty();
    setQuantity(prev => Math.max(minQuantity, prev - 1));
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    const variantMoq = variant.moq || product.moq || 1;
    const minQty = isWholesale ? Math.max(3, variantMoq) : Math.max(1, variantMoq);
    setQuantity(minQty);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1F44]/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-[#0A1F44] font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1F44]/5 to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">Product Not Found</h2>
          <Button onClick={() => navigate('/shop')} className="bg-[#0A1F44] text-white">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const price = calculatePrice(selectedVariant);
  const images = product.productImages || [];
  const mainImage = images[selectedImage]?.imageUrl;
  const minQty = getMinQty();
  const hasVariants = product.productType === 'variable' && product.variants?.length > 0;

  return (
    <>
      <Helmet>
        <title>{product.name} - GIVORA</title>
        <meta name="description" content={product.description || "Product details"} />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/shop')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#0A1F44]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Button>
        </div>

        <div className="container mx-auto px-4 pb-12">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images - FIXED */}
              <div className="p-6 lg:p-8">
                {/* Main Image Container - خلفية فاتحة */}
                <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-center h-[450px] mb-6">
                  {mainImage && !imageError ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                        onError={handleImageError}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="text-center w-full">
                      <div className="bg-gray-100 rounded-xl p-8 inline-block">
                        <ImageIcon className="w-32 h-32 text-gray-400 mx-auto mb-6" />
                        <p className="text-gray-600 text-lg font-medium">Image not available</p>
                        <p className="text-gray-500 text-sm mt-2">{product.name}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Thumbnails */}
                {images.length > 1 && (
                  <div className="border-t pt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">More Images</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedImage(index);
                            setImageError(false);
                          }}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index 
                              ? 'border-[#0A1F44] ring-2 ring-[#0A1F44]/20' 
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={img.imageUrl}
                            alt={`${product.name} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Details */}
              <div className="p-6 lg:p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-[#0A1F44] text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                      {product.category}
                    </span>
                    <ProductTypeBadge 
                      type={product.productType} 
                      variantsCount={product.variants?.length} 
                    />
                  </div>

                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      <span className="font-medium">SKU: {product.sku}</span>
                    </div>
                    {hasVariants && (
                      <div className="flex items-center gap-1 text-[#C9A227]">
                        <Grid3x3 className="w-4 h-4" />
                        <span className="font-medium">{product.variants.length} variants available</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Section - خلفية فاتحة */}
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="flex items-baseline gap-4 mb-4">
                    <span className="text-4xl font-bold text-[#0A1F44]">
                      ${price.toFixed(2)}
                    </span>
                    {isWholesale && selectedVariant?.retailPrice > selectedVariant?.wholesalePrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ${selectedVariant.retailPrice.toFixed(2)}
                      </span>
                    )}
                    {!selectedVariant && isWholesale && product.retailPrice > product.wholesalePrice && (
                      <span className="text-xl text-gray-400 line-through">
                        ${product.retailPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {isWholesale && (
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <Check className="w-5 h-5" />
                        <span>Wholesale Pricing Active</span>
                        {volumeDiscount > 0 && (
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            +{Math.round(volumeDiscount * 100)}% Volume Discount
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Zap className="w-5 h-5" />
                      <span className="font-medium">MOQ: {minQty} units</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Package className="w-5 h-5" />
                      <span className="font-medium">
                        Stock: {
                          selectedVariant 
                            ? `${selectedVariant.stockQuantity} units available`
                            : `${product.stockQuantity} units available`
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Product Description</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {product.description || "Professional quality product designed for institutional use."}
                    </p>
                  </div>
                </div>

                {/* Variants Section */}
                {hasVariants && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Available Variants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.variants
                        .filter(v => v.isActive !== false)
                        .map((variant) => (
                        <div
                          key={variant.id}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedVariant?.id === variant.id
                              ? 'border-[#C9A227] bg-gradient-to-r from-[#C9A227]/5 to-[#C9A227]/10'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => handleVariantSelect(variant)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{variant.variantSku}</h4>
                              <div className="space-y-1 mt-2">
                                {variant.dimensions && variant.dimensions !== 'N/A' && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Dimensions:</span> {variant.dimensions}
                                  </p>
                                )}
                                {variant.packetSize && (
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Packet Size:</span> {variant.packetSize}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#0A1F44]">
                                ${(isWholesale ? variant.wholesalePrice : variant.retailPrice).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500 mt-1">
                                Stock: {variant.stockQuantity}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                            <div>
                              {variant.isDefault && (
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                                  DEFAULT
                                </span>
                              )}
                            </div>
                            {selectedVariant?.id === variant.id && (
                              <span className="text-[#C9A227] font-medium flex items-center gap-1">
                                <Check className="w-4 h-4" />
                                Selected
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity and Add to Cart */}
                <div className="border-t pt-8">
                  <div className="mb-8">
                    <label className="block font-bold text-gray-900 text-lg mb-4">Select Quantity</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-2">
                        <button
                          onClick={decreaseQuantity}
                          disabled={quantity <= minQty}
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            quantity <= minQty
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="w-16 text-center font-bold text-gray-900 text-2xl">
                          {quantity}
                        </span>
                        <button
                          onClick={increaseQuantity}
                          className="w-12 h-12 rounded-lg flex items-center justify-center hover:bg-gray-100"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="ml-6">
                        <p className="text-lg text-gray-600 mb-1">
                          Total Price:
                        </p>
                        <p className="font-bold text-3xl text-[#0A1F44]">
                          ${(price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      Minimum order quantity: {minQty} units
                    </p>
                  </div>

                  {user ? (
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-gradient-to-r from-[#C9A227] to-[#B5941F] hover:from-[#B5941F] hover:to-[#A5851C] text-white py-5 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ShoppingCart className="w-6 h-6 mr-3" />
                      Add to Cart - ${(price * quantity).toFixed(2)}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate('/login')}
                      className="w-full bg-gradient-to-r from-[#C9A227] to-[#B5941F] text-white py-5 rounded-xl font-bold text-xl"
                    >
                      Login to Purchase
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
