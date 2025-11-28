import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, ShoppingCart, ChevronDown, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, cart } = useAuth();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Industries', href: '/industries' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Calculate total items in cart
  const cartItemCount = cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-[#D9DFE7]/20' 
        : 'bg-white shadow-sm'
    }`}>
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-[#0A1F44] to-[#0A1F44]/90 p-2 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#0A1F44] to-[#C9A227] bg-clip-text text-transparent">
                GIVORA
              </span>
              {user && (
                <p className="text-xs text-[#C9A227] font-medium -mt-1">
                  {user.account_type === 'wholesale' ? 'Wholesale' : 'Retail'}
                </p>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-[#C9A227]'
                    : 'text-[#0A1F44] hover:text-[#C9A227]'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C9A227] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Cart */}
            {user && (
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative text-[#0A1F44] hover:text-[#C9A227] transition-all duration-300 hover:scale-105">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-[#C9A227] to-[#B5941F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg"
                    >
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </motion.span>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-[#0A1F44] hover:text-[#C9A227] transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#0A1F44] to-[#C9A227] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.first_name ? user.first_name[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </Button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#D9DFE7] py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-[#D9DFE7]/20">
                        <p className="font-semibold text-[#0A1F44]">
                          {user.first_name ? `Hello, ${user.first_name}` : 'Welcome!'}
                        </p>
                        <p className="text-sm text-[#0A1F44]/60">{user.email}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <div className={`w-2 h-2 rounded-full ${
                            user.account_type === 'wholesale' ? 'bg-[#C9A227]' : 'bg-[#0A1F44]'
                          }`} />
                          <span className="text-xs text-[#0A1F44]/60 capitalize">
                            {user.account_type} Account
                          </span>
                        </div>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-[#0A1F44] hover:bg-[#0A1F44]/5 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-[#0A1F44] hover:text-[#C9A227] transition-colors duration-300 p-2 rounded-lg hover:bg-[#0A1F44]/5"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 border-t border-[#D9DFE7]/20 pt-4"
            >
              <div className="flex flex-col space-y-3">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-[#C9A227]/10 text-[#C9A227] border-l-4 border-[#C9A227]'
                        : 'text-[#0A1F44] hover:bg-[#0A1F44]/5 hover:text-[#C9A227]'
                    }`}
                  >
                    <div className={`w-1 h-1 rounded-full ${
                      isActive(item.href) ? 'bg-[#C9A227]' : 'bg-[#0A1F44]/30'
                    }`} />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {user && (
                  <Link 
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-[#0A1F44] hover:bg-[#0A1F44]/5 hover:text-[#C9A227] transition-all duration-200"
                  >
                    <div className="w-1 h-1 rounded-full bg-[#0A1F44]/30" />
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart ({cartItemCount})</span>
                  </Link>
                )}

                {user ? (
                  <>
                    <Link 
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-[#0A1F44] hover:bg-[#0A1F44]/5 hover:text-[#C9A227] transition-all duration-200"
                    >
                      <div className="w-1 h-1 rounded-full bg-[#0A1F44]/30" />
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left"
                    >
                      <div className="w-1 h-1 rounded-full bg-red-400" />
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="pt-2 border-t border-[#D9DFE7]/20">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition-all duration-300"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Backdrop for user menu */}
      {userMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;