import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Filter, Tag, Zap, X, Plus, Minus, Info, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { productsAPI } from '@/lib/api';

const Shop = () => {
  const { user, getDiscountRate, addToCart, isUserWholesale } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        console.log('🔍 Products API Response:', response);
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const categories = ['all', 'Tissue', 'Paper Towels', 'Gloves', 'Garbage Bags', 'Underpads', 'Cups', 'Paper Bags'];

  // فلترة المنتجات بناءً على البحث والفئة المختارة
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const isWholesale = isUserWholesale();
  const volumeDiscount = getDiscountRate();

  console.log('🔍 Shop Debug:', {
    user: user,
    isWholesale: isWholesale,
    volumeDiscount: volumeDiscount,
    searchQuery: searchQuery,
    filteredCount: filteredProducts.length
  });

  const calculatePrice = (product) => {
    let price = isWholesale ? product.wholesalePrice : product.retailPrice;

    if (isWholesale && volumeDiscount > 0) {
      price = price * (1 - volumeDiscount);
    }

    console.log('🔍 Price Calculation:', {
      product: product.name,
      isWholesale,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      volumeDiscount,
      finalPrice: price
    });

    return price;
  };

  const handleAddToCart = (product, qty = 1) => {
    const minQty = isWholesale ? Math.max(3, product.moq || 3) : 1;
    const quantity = Math.max(qty, minQty);

    if (isWholesale && qty < minQty) {
      toast({
        title: "Minimum Quantity Required",
        description: `Wholesale customers must order at least ${minQty} units of ${product.name}.`,
        variant: "destructive"
      });
      setQuantity(minQty);
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} has been added to your cart`,
    });
    setSelectedProduct(null);
    setQuantity(isWholesale ? minQty : 1);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setQuantity(isWholesale ? 3 : 1);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
    setQuantity(isWholesale ? 3 : 1);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    const minQuantity = isWholesale ? 3 : 1;
    setQuantity(prev => Math.max(minQuantity, prev - 1));
  };

  const nextImage = () => {
    if (selectedProduct && selectedProduct.productImages) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.productImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.productImages) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.productImages.length - 1 : prev - 1
      );
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // دالة لمعالجة أخطاء الصور
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA2MEgxMjBWODBIMzBWMTIwSDEyMFYxNDBIODBWMTIwSDEyMFY4MEg4MFY2MFoiIGZpbGw9IiM5Q0EwQjMiLz4KPHN2Zz4K';
    e.target.alt = 'Image not available';
    e.target.className = e.target.className.replace('object-contain', 'object-cover');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1F44]/5 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C9A227] mx-auto mb-4"></div>
          <p className="text-[#0A1F44] font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop Institutional Supplies - GIVORA</title>
        <meta name="description" content="Browse our comprehensive catalog of institutional supplies. Wholesale pricing available for approved B2B customers." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#1E3A8A] text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Shop <span className="bg-gradient-to-r from-[#C9A227] to-[#E5C158] bg-clip-text text-transparent">Products</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#D9DFE7] mb-8 leading-relaxed">
              Professional-grade supplies for institutional use with wholesale pricing
            </p>
            
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#C9A227] mb-1">
                  {products.length}+
                </div>
                <div className="text-sm text-[#D9DFE7]">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#C9A227] mb-1">
                  8
                </div>
                <div className="text-sm text-[#D9DFE7]">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-[#C9A227] mb-1">
                  24/7
                </div>
                <div className="text-sm text-[#D9DFE7]">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wholesale Info Banner */}
      {isWholesale && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-blue-800 text-sm font-medium">
                <strong>Wholesale Account Active:</strong> You're viewing wholesale prices. Minimum 3 units per item required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 p-2 rounded-lg">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-2xl text-[#0A1F44]">Filter Products</h2>
                <p className="text-[#0A1F44]/60 text-sm">Browse by category or search</p>
              </div>
            </div>

            {isWholesale && !searchQuery && selectedCategory === 'all' && (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-[#C9A227] to-[#B5941F] text-white px-6 py-3 rounded-xl shadow-lg"
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Tag className="w-5 h-5" />
                  <span>Wholesale Account Active</span>
                  {volumeDiscount > 0 && (
                    <span className="bg-white text-[#C9A227] px-2 py-1 rounded-full text-sm font-bold ml-2">
                      +{volumeDiscount * 100}% Volume Bonus
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* شريط البحث تحت الفلاتر */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#0A1F44] w-5 h-5" />
              <input
                type="text"
                placeholder="Search products by name, category, or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl text-[#0A1F44] focus:outline-none focus:ring-2 focus:ring-[#C9A227] shadow-lg border border-[#D9DFE7]"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#0A1F44] hover:text-[#C9A227] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>

          {/* معلومات نتائج البحث */}
          {(searchQuery || selectedCategory !== 'all') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-[#C9A227] to-[#B5941F] text-white px-6 py-3 rounded-xl shadow-lg mb-6 inline-flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="font-semibold">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="bg-white text-[#C9A227] px-2 py-1 rounded-full text-sm font-bold ml-2 hover:bg-gray-100 transition-colors"
              >
                Clear All
              </button>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white shadow-lg'
                    : 'bg-white border-2 border-[#D9DFE7] text-[#0A1F44] hover:border-[#0A1F44] hover:shadow-md'
                }`}
              >
                {category === 'all' ? 'All Products' : category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#D9DFE7] hover:border-[#C9A227]/30 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => openProductModal(product)}
              >
                {/* Product Image - Improved Display */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-72 relative overflow-hidden">
                  <div className="h-full relative flex items-center justify-center p-4">
                    {product.productImages && product.productImages.length > 0 ? (
                      <>
                        {/* Main Image with Fallback Handling */}
                        <img
                          src={product.productImages[0].imageUrl}
                          alt={product.name}
                          className="max-w-full max-h-48 object-contain transition-transform duration-500 group-hover:scale-105"
                          onError={handleImageError}
                          loading="lazy"
                        />
                        
                        {/* Fallback Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 -z-10"></div>
                      </>
                    ) : (
                      // Fallback when no images
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                        <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                          <span className="text-gray-500 text-xs">No Image</span>
                        </div>
                        <p className="text-gray-500 text-sm text-center px-4">
                          {product.name}
                        </p>
                      </div>
                    )}
                    
                    {/* Image Counter */}
                    {product.productImages && product.productImages.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                        +{product.productImages.length - 1}
                      </div>
                    )}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.stockQuantity < 1000 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                        Low Stock
                      </span>
                    )}
                    {isWholesale && volumeDiscount > 0 && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                        Volume Discount
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="bg-[#0A1F44] text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-[#0A1F44] mb-2 line-clamp-2 group-hover:text-[#C9A227] transition-colors">
                    {product.name}
                  </h3>
                  
                  <p className="text-xs text-[#0A1F44]/50 mb-4 font-mono">
                    SKU: {product.sku}
                  </p>

                  {/* Product Description Preview */}
                  <div className="mb-4 flex-grow">
                    <p className="text-sm text-[#0A1F44]/70 line-clamp-3 leading-relaxed">
                      {product.description || "No description available."}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-2xl font-bold text-[#0A1F44]">
                        ${calculatePrice(product).toFixed(2)}
                      </span>
                      {isWholesale && product.retailPrice > product.wholesalePrice && (
                        <span className="text-sm text-[#0A1F44]/50 line-through">
                          ${product.retailPrice.toFixed(2)}
                        </span>
                      )}
                      {isWholesale && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                          Wholesale Price
                        </span>
                      )}
                      {isWholesale && volumeDiscount > 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                          Save {((product.retailPrice - calculatePrice(product)) / product.retailPrice * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#0A1F44]/60 mb-4">
                      <Zap className="w-4 h-4" />
                      <span>MOQ: {isWholesale ? Math.max(3, product.moq) : product.moq} units</span>
                    </div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product, isWholesale ? 3 : 1);
                        }}
                        className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 hover:from-[#C9A227] hover:to-[#B5941F] text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {isWholesale ? 'Add 3 to Cart' : 'Add to Cart'}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0A1F44] mb-2">
                {searchQuery ? 'No products found' : 'No products in this category'}
              </h3>
              <p className="text-[#0A1F44]/60 mb-6">
                {searchQuery 
                  ? `No products found matching "${searchQuery}". Try different keywords.`
                  : 'Try selecting a different category or check back later for new products.'
                }
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white"
                >
                  View All Products
                </Button>
                {searchQuery && (
                  <Button
                    onClick={clearSearch}
                    variant="outline"
                    className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white"
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeProductModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
                {/* Product Image - Improved Display */}
                <div className="lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col">
                  <div className="flex-grow relative flex items-center justify-center">
                    {selectedProduct.productImages && selectedProduct.productImages.length > 0 ? (
                      <div className="h-full flex flex-col w-full">
                        {/* Main Image with Navigation */}
                        <div className="relative flex-grow mb-4 flex items-center justify-center">
                          <img
                            src={selectedProduct.productImages[currentImageIndex].imageUrl}
                            alt={selectedProduct.name}
                            className="max-w-full max-h-96 object-contain"
                            onError={handleImageError}
                          />
                          
                          {/* Navigation Arrows */}
                          {selectedProduct.productImages.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                              >
                                <ChevronLeft className="w-5 h-5" />
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-all"
                              >
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          
                          {/* Image Counter */}
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                            {currentImageIndex + 1} / {selectedProduct.productImages.length}
                          </div>
                        </div>
                        
                        {/* Thumbnails */}
                        {selectedProduct.productImages.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto py-2 justify-center">
                            {selectedProduct.productImages.map((image, index) => (
                              <img
                                key={image.id}
                                src={image.imageUrl}
                                alt={`${selectedProduct.name} ${index + 1}`}
                                className={`w-16 h-16 object-cover rounded border cursor-pointer flex-shrink-0 ${
                                  index === currentImageIndex ? 'border-blue-500 border-2' : 'border-gray-300'
                                }`}
                                onClick={() => setCurrentImageIndex(index)}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNEg0MFY0MEgyNFYyNFoiIGZpbGw9IiM5Q0EwQjMiLz4KPHN2Zz4K';
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded">
                        <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                          <span className="text-gray-500">No Image</span>
                        </div>
                        <p className="text-gray-600 text-center px-4">
                          {selectedProduct.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details */}
                <div className="lg:w-1/2 p-8 flex flex-col overflow-y-auto">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-sm font-semibold text-[#C9A227] uppercase tracking-wide">
                        {selectedProduct.category}
                      </span>
                      <h2 className="text-2xl font-bold text-[#0A1F44] mt-1">
                        {selectedProduct.name}
                      </h2>
                      <p className="text-sm text-[#0A1F44]/50 font-mono mt-1">
                        SKU: {selectedProduct.sku}
                      </p>
                    </div>
                    <button
                      onClick={closeProductModal}
                      className="text-[#0A1F44]/50 hover:text-[#0A1F44] transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Product Description - More Space */}
                  <div className="mb-6 flex-grow">
                    <h3 className="font-semibold text-[#0A1F44] mb-3 text-lg">Product Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <p className="text-[#0A1F44]/80 leading-relaxed text-base">
                        {selectedProduct.description || "No description available."}
                      </p>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-3xl font-bold text-[#0A1F44]">
                        ${calculatePrice(selectedProduct).toFixed(2)}
                      </span>
                      {isWholesale && selectedProduct.retailPrice > selectedProduct.wholesalePrice && (
                        <span className="text-lg text-[#0A1F44]/50 line-through">
                          ${selectedProduct.retailPrice.toFixed(2)}
                        </span>
                      )}
                      {isWholesale && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Wholesale Price
                        </span>
                      )}
                      {isWholesale && volumeDiscount > 0 && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          Save {((selectedProduct.retailPrice - calculatePrice(selectedProduct)) / selectedProduct.retailPrice * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#0A1F44]/60">
                      <Zap className="w-4 h-4" />
                      <span>Minimum Order Quantity: {isWholesale ? Math.max(3, selectedProduct.moq) : selectedProduct.moq} units</span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mb-6">
                    <label className="block font-semibold text-[#0A1F44] mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= (isWholesale ? 3 : 1)}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                          quantity <= (isWholesale ? 3 : 1)
                            ? 'border-gray-300 text-gray-300 cursor-not-allowed'
                            : 'border-[#D9DFE7] text-[#0A1F44] hover:bg-[#0A1F44]/5'
                        }`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-16 text-center font-semibold text-[#0A1F44] text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQuantity}
                        className="w-10 h-10 rounded-lg border border-[#D9DFE7] flex items-center justify-center hover:bg-[#0A1F44]/5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#0A1F44]/50 mt-2">
                      {isWholesale 
                        ? 'Minimum 3 units required for wholesale orders' 
                        : 'Minimum order: 1 unit'
                      }
                    </p>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-auto pt-4">
                    <Button
                      onClick={() => handleAddToCart(selectedProduct, quantity)}
                      className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 hover:from-[#C9A227] hover:to-[#B5941F] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add {quantity} to Cart - ${(calculatePrice(selectedProduct) * quantity).toFixed(2)}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Shop;