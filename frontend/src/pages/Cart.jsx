import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, getDiscountRate, user, isUserWholesale } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isWholesale = isUserWholesale();
  const volumeDiscount = getDiscountRate();

  // تحديد الحد الأدنى للكمية بناءً على نوع المستخدم
  const getMinQuantity = () => {
    return isWholesale ? 3 : 1;
  };

  const calculateItemPrice = (item) => {
    let price;
    if (item.variant) {
      // If variant is selected, use variant pricing
      price = isWholesale ? item.variant.wholesalePrice : item.variant.retailPrice;
    } else {
      // Otherwise use product pricing
      const product = item.product;
      price = isWholesale ? product.wholesalePrice : product.retailPrice;
    }
    
    if (isWholesale && volumeDiscount > 0) {
      price = price * (1 - volumeDiscount);
    }
    
    return price;
  };

  const handleDecrease = async (item) => {
    const minQuantity = getMinQuantity();
    const newQuantity = item.quantity - 1;
    
    if (newQuantity < minQuantity) {
      if (isWholesale) {
        toast({
          title: 'Minimum Quantity Required',
          description: 'Wholesale customers must have at least 3 units per item.',
          variant: 'destructive',
        });
        return;
      } else {
        if (newQuantity < 1) {
          await removeFromCart(item.id);
          return;
        }
      }
    }
    
    await updateCartQuantity(item.id, newQuantity);
  };

  const handleIncrease = async (item) => {
    await updateCartQuantity(item.id, item.quantity + 1);
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemTotal = calculateItemPrice(item) * item.quantity;
    return sum + itemTotal;
  }, 0);

  // التحقق إذا كان هناك أي عنصر أقل من الحد الأدنى لعميل الجملة
  const hasInvalidQuantities = isWholesale && cart.some(item => item.quantity < 3);

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-[#0A1F44]/10 p-8 rounded-full">
            <ShoppingBag className="w-12 h-12 text-[#0A1F44]" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-[#0A1F44] mb-4">Your Cart is Empty</h2>
        <p className="text-[#0A1F44]/70 mb-8">Looks like you haven't added any items yet.</p>
        <Link to="/shop">
          <Button size="lg" className="bg-[#0A1F44] text-white hover:bg-[#0A1F44]/90">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shopping Cart - GIVORA</title>
      </Helmet>

      <div className="bg-[#0A1F44] text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {isWholesale && (
            <p className="text-sm text-gray-300 mt-2">
              Wholesale account: Minimum 3 units per item required
            </p>
          )}
        </div>
      </div>

      {/* Wholesale Info Banner */}
      {isWholesale && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-blue-800 text-sm font-medium">
                <strong>Wholesale Account:</strong> You're viewing wholesale prices. Minimum 3 units per item required.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => {
              const minQuantity = getMinQuantity();
              const canDecrease = !isWholesale || item.quantity > minQuantity;
              const itemPrice = calculateItemPrice(item);
              
              return (
                <div key={item.id} className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row gap-6 items-center">
                  {/* Product Info */}
                  
                  <div className="flex-grow text-center sm:text-left">
                    <h3 className="font-bold text-[#0A1F44] text-lg">{item.product.name}</h3>
                    <div className="text-sm text-[#0A1F44]/60 mb-3">
                      <p>SKU: {item.product.sku}</p>
                      {/* Display variant info if available */}
                      {item.variant && (
                        <div className="mt-2 space-y-1">
                          <p className="font-medium text-[#0A1F44]">
                            Variant: {item.variant.variantSku}
                          </p>
                          {item.variant.dimensions && item.variant.dimensions !== 'N/A' && (
                            <p>Dimensions: {item.variant.dimensions}</p>
                          )}
                          {item.variant.packetSize && (
                            <p>Packet Size: {item.variant.packetSize}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium text-[#C9A227]">
                        ${itemPrice.toFixed(2)} 
                        <span className="text-xs text-gray-400">/ unit</span>
                      </p>
                      {isWholesale && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Wholesale Price
                        </span>
                      )}
                    </div>
                    {isWholesale && item.quantity < 3 && (
                      <p className="text-xs text-red-500 mt-1">
                        Minimum 3 units required for wholesale orders
                      </p>
                    )}
                    {isWholesale && volumeDiscount > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        Volume discount applied: {(volumeDiscount * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#D9DFE7] rounded">
                      <button
                        className={`p-2 ${
                          !canDecrease 
                            ? 'text-gray-400 cursor-not-allowed' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => canDecrease && handleDecrease(item)}
                        disabled={!canDecrease}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        className="p-2 hover:bg-gray-100"
                        onClick={() => handleIncrease(item)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      className="text-red-500 hover:bg-red-50 p-2 rounded"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-[#0A1F44] mb-6">Order Summary</h3>

              {hasInvalidQuantities && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ Some items are below the minimum wholesale quantity (3 units)
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[#0A1F44]/80">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {isWholesale && volumeDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Volume Discount ({(volumeDiscount * 100).toFixed(0)}%)</span>
                    <span>-${(subtotal * volumeDiscount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#0A1F44]/80">
                  <span>Shipping</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-[#0A1F44]/80">
                  <span>Tax</span>
                  <span className="text-sm text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-xl text-[#0A1F44]">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {isWholesale && (
                  <p className="text-xs text-green-600 mt-2">
                    💰 You're saving with wholesale pricing
                  </p>
                )}
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#0A1F44] hover:bg-[#0A1F44]/90 text-white h-12 text-lg"
                disabled={hasInvalidQuantities}
              >
                {hasInvalidQuantities 
                  ? "Adjust Quantities to Proceed" 
                  : "Proceed to Checkout"
                }
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <div className="mt-4 text-center">
                <Link to="/shop" className="text-sm text-[#0A1F44]/70 hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;