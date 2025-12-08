import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ShoppingCart, Zap, Search, X, Package, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { productsAPI } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import ProductTypeBadge from '@/components/ui/ProductTypeBadge';

const Shop = () => {
  const { user, getDiscountRate, addToCart, isUserWholesale } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
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

  const categories = ['all', 'Tissue', 'Restaurant', 'Gloves', 'Garbage Bags', 'Medical', 'Cups', 'Paper Bags', 'Pizza Box', ];
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const isWholesale = isUserWholesale();
  const volumeDiscount = getDiscountRate();

  const calculatePrice = (product) => {
    let price = isWholesale ? product.wholesalePrice : product.retailPrice;
    if (isWholesale && volumeDiscount > 0) {
      price = price * (1 - volumeDiscount);
    }
    return price;
  };

  const handleAddToCart = (product, qty = 1) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    // If product has variants, navigate to product detail page for variant selection
    if (product.productType === 'variable' && product.variants?.length > 0) {
      navigate(`/product/${product.id}`);
      return;
    }

    // For simple products, add directly to ca
    const minQty = isWholesale ? Math.max(3, product.moq || 3) : 1;
    const quantity = Math.max(qty, minQty);

    if (isWholesale && qty < minQty) {
      toast({
        title: "Minimum Quantity Required",
        description: `Wholesale customers must order at least ${minQty} units of ${product.name}.`,
        variant: "destructive"
      });
      return;
    }

    addToCart(product, quantity);
    
    toast({
      title: "Added to Cart",
      description: `${quantity} x ${product.name} has been added to your cart`,
    });
  };

  const viewProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
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

      <section className="relative bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#1E3A8A] text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Shop <span className="text-[#C9A227]">Products</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Professional-grade supplies for institutional use
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-[#0A1F44] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Check if product has variants
            const hasVariants = product.productType === 'variable' && product.variants?.length > 0;
            const variantCount = product.variants?.length || 0;
            
            return (
              <div key={product.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-[500px]">
                {/* Image Container - Fill div with 2px border */}
                <div 
                  className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden cursor-pointer group border-2 border-gray-300"
                  onClick={() => viewProductDetails(product.id)}
                >
                  {product.productImages?.[0] ? (
                    <div className="relative w-full h-full">
                      <img
                        src={product.productImages[0].imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <Package class="w-16 h-16 text-gray-400 mb-2" />
                              <span class="text-gray-500 text-sm">No Image Available</span>
                            </div>
                          `;
                        }}
                      />
                      {/* Overlay effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Package className="w-16 h-16 text-gray-400 mb-2" />
                      <span className="text-gray-500 text-sm">No Image Available</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <ProductTypeBadge 
                      type={product.productType} 
                      variantsCount={variantCount} 
                    />
                  </div>
                  {hasVariants && (
                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-medium text-[#0A1F44] px-2 py-1 rounded-full">
                      {variantCount} variants available
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 
                        className="font-bold text-gray-900 cursor-pointer hover:text-[#0A1F44] transition-colors duration-200 line-clamp-1"
                        onClick={() => viewProductDetails(product.id)}
                      >
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-[#0A1F44]/10 text-[#0A1F44] px-2 py-1 rounded">
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          SKU: {product.sku}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                    {product.description || 'Professional quality product for institutional use.'}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-[#0A1F44]">
                          ${calculatePrice(product).toFixed(2)}
                        </div>
                        {hasVariants && (
                          <div className="text-xs text-gray-500 mt-1">
                            Starting from ${calculatePrice(product).toFixed(2)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Zap className="w-4 h-4" />
                        <span>MOQ: {isWholesale ? Math.max(3, product.moq) : product.moq}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => viewProductDetails(product.id)}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1"
                      >
                        View Details
                      </button>
                      
                      {user ? (
                        <button
                          onClick={() => handleAddToCart(product, isWholesale ? 3 : 1)}
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 flex-1 bg-[#C9A227] hover:bg-[#C9A227]/90"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </button>
                      ) : (
                        <button
                          onClick={() => navigate('/login')}
                          className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 text-sm font-medium hover:from-amber-600 hover:to-yellow-600 transition-all duration-200">
                          Login to Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : 'No products in this category'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground h-10 px-4 py-2 bg-[#0A1F44] hover:bg-[#0A1F44]/90"
            >
              <span className="text-[#C9A227]">View All Products</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Shop;
