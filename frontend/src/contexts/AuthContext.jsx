import React, { createContext, useContext, useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useToast } from '@/components/ui/use-toast';
import { authAPI, cartAPI, wholesaleAPI, adminAPI } from '@/lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [wholesaleDetails, setWholesaleDetails] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const refreshCart = async (userId) => {
    if (!userId) return;
    try {
      const res = await cartAPI.get();
      if (res.success && res.data.cartItems) {
        setCart(res.data.cartItems);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error);
      setCart([]);
    }
  };

  // ✅ جلب الجلسات عند تحميل التطبيق
  useEffect(() => {
    const fetchUser = async () => {
      // === جلسة المستخدم العادي ===
      const userToken = localStorage.getItem('givora_session_token');
      if (userToken) {
        try {
          const res = await authAPI.getProfile();
          if (res.success && res.data.user) {
            const dbUser = res.data.user;
            setUser(dbUser);
            refreshCart(dbUser.id);
            if (dbUser.account_type === 'wholesale') {
              try {
                const details = await wholesaleAPI.getStatus();
                setWholesaleDetails(details);
              } catch (err) {
                console.error('Failed to fetch wholesale details', err);
              }
            }
          } else {
            throw new Error('Invalid user session');
          }
        } catch (e) {
          console.error('User session verification failed:', e);
          localStorage.removeItem('givora_session_token');
          setUser(null);
        }
      }

      // === جلسة الـ Admin ===
      const adminToken = localStorage.getItem('givora_admin_token');
      if (adminToken) {
        try {
          console.log('🔐 Checking admin session...');
          const res = await adminAPI.getProfile();
          console.log('📨 Admin profile response:', res);
          
          if (res.success && res.data.admin) {
            setAdminUser(res.data.admin);
            console.log('✅ Admin session verified:', res.data.admin);
          } else {
            throw new Error('Invalid admin session');
          }
        } catch (e) {
          console.error('❌ Admin session verification failed:', e);
          localStorage.removeItem('givora_admin_token');
          setAdminUser(null);
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  // === وظائف تسجيل الدخول والتسجيل ===
  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success) {
      const { token, user: dbUser } = res.data;
      localStorage.setItem('givora_session_token', token);
      setUser(dbUser);
      refreshCart(dbUser.id);
      if (dbUser.account_type === 'wholesale') {
        try {
          const details = await wholesaleAPI.getStatus();
          setWholesaleDetails(details);
        } catch (err) {
          console.error('Failed to fetch wholesale details', err);
        }
      }
      return dbUser;
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const adminLogin = async (email, password) => {
    try {
      console.log('🔐 Admin login attempt:', email);
      const res = await adminAPI.login({ email, password });
      console.log('📨 Admin login response:', res);
      
      if (res.success) {
        const { token, admin } = res.data;
        console.log('✅ Admin token received, admin data:', admin);
        
        localStorage.setItem('givora_admin_token', token);
        setAdminUser(admin);
        return admin;
      } else {
        throw new Error(res.message || 'Admin login failed');
      }
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw new Error(error.message || 'Admin login failed');
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('givora_admin_token');
  };

  const logout = async () => {
    setUser(null);
    setWholesaleDetails(null);
    setCart([]);
    localStorage.removeItem('givora_session_token');
  };

  // === Google Login ===
  const [googleLoginResolver, setGoogleLoginResolver] = useState(null);
  const loginWithGoogle = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const { code } = codeResponse;
        const res = await authAPI.loginWithGoogle({ code });
        if (res.success) {
          const { token, user: dbUser } = res.data;
          localStorage.setItem('givora_session_token', token);
          setUser(dbUser);
          refreshCart(dbUser.id);
          if (googleLoginResolver) googleLoginResolver.resolve(dbUser);
        } else {
          throw new Error(res.message || 'Google login failed');
        }
      } catch (error) {
        console.error('Google Login Error:', error);
        if (googleLoginResolver) googleLoginResolver.reject(error);
      } finally {
        setGoogleLoginResolver(null);
      }
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      if (googleLoginResolver) googleLoginResolver.reject(error);
      setGoogleLoginResolver(null);
    }
  });

  const googleLogin = () => {
    return new Promise((resolve, reject) => {
      setGoogleLoginResolver({ resolve, reject });
      loginWithGoogle();
    });
  };

  // === التسجيل والتحقق ===
  const register = async (userData) => {
    const res = await authAPI.register({
      email: userData.email,
      password: userData.password,
      accountType: userData.accountType,
      firstName: userData.first_name,
      lastName: userData.last_name,
      phone: userData.phone,
      address: userData.address
    });
    if (res.success) {
      return res.data.user;
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const verifyEmail = async (verificationMail, verificationCode) => {
    try {
      const res = await authAPI.verifyEmail(verificationMail, verificationCode);
      return res.success;
    } catch (error) {
      console.error('Verify email error:', error);
      return false;
    }
  };

  // === تحديث الملف الشخصي ===
  const updateUserProfile = async (updates) => {
    if (!user) return;
    const res = await authAPI.updateProfile(updates);
    if (res.success) {
      setUser(res.data.user);
      return res.data.user;
    }
  };

  // === نسيان كلمة المرور ===
  const requestPasswordReset = async (email) => {
    const res = await authAPI.forgotPassword(email);
    if (res.success) {
      return res.token;
    } else {
      throw new Error(res.message);
    }
  };

  const resetPassword = async (token, newPassword) => {
    const res = await authAPI.resetPassword(token, newPassword);
    if (!res.success) {
      throw new Error(res.message || 'Reset password failed');
    }
  };

  // === السلة والخصومات ===
  const getDiscountRate = () => {
    if (!user || user.account_type !== 'wholesale' || !user.approved) return 0;
    if (wholesaleDetails && wholesaleDetails.total_units_ordered > 10000) {
      return 0.1;
    }
    return 0;
  };

  const addToCart = async (product, quantity = 1, variantId = null) => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please register or login to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }
    try {
      console.log('🛒 Adding to cart:', { productId: product.id, quantity, variantId });
      await cartAPI.add(product.id, quantity, variantId);
      refreshCart(user.id);
      toast({
        title: 'Added to Cart',
        description: `${quantity} x ${product.name} added to your cart.`,
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      
      // Extract error message from response
      let errorMsg = 'Failed to add item to cart.';
      if (error && error.errors && Array.isArray(error.errors)) {
        errorMsg = error.errors.map(e => e.message).join(', ');
        console.error('Validation errors:', error.errors);
      } else if (error && error.message) {
        errorMsg = error.message;
      }
      
      console.error('Final error message:', errorMsg);
      
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartAPI.remove(itemId);
      refreshCart(user.id);
    } catch (error) {
      console.error('Remove from cart error:', error);
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    try {
      await cartAPI.update(itemId, quantity);
      refreshCart(user.id);
    } catch (error) {
      console.error('Update cart error:', error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await cartAPI.clear();
      setCart([]);
    } catch (error) {
      console.error('Clear cart error:', error);
    }
  };

  // ✅ دالة التحقق من حالة تاجر الجملة
  const isUserWholesale = () => {
    if (!user) return false;
    
    const accountType = user.account_type || user.accountType;
    const approved = user.approved;
    
    console.log('🔍 Checking wholesale status:', {
      user: user,
      account_type: accountType,
      approved: approved,
      isWholesale: accountType === 'wholesale' && approved === true
    });
    
    return accountType === 'wholesale' && approved === true;
  };

  const value = {
    user,
    adminUser,
    wholesaleDetails,
    loading,
    cart,
    login,
    adminLogin,
    adminLogout,
    googleLogin,
    register,
    verifyEmail,
    logout,
    updateUserProfile,
    requestPasswordReset,
    resetPassword,
    getDiscountRate,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    refreshCart,
    isUserWholesale, // ✅ مضافة هنا
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};