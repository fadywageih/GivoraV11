import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, User, Building, Shield, Truck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-gradient-to-b from-[#0A1F44] to-[#0A1F44]/95 text-white mt-20 relative z-10">
      {/* Wave Decoration */}
      <div className="absolute top-0 left-0 w-full overflow-hidden transform -translate-y-1">
        <svg 
          className="relative block w-full h-8" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-white"
          ></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8">
        {/* User Welcome Section - Only shown when logged in */}
        {user && (
          <div className="max-w-6xl mx-auto mb-12 p-6 bg-gradient-to-r from-[#C9A227]/10 to-[#C9A227]/5 rounded-2xl border border-[#C9A227]/20">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="bg-[#C9A227] p-3 rounded-full">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Welcome back, {user.first_name || user.email}!
                  </h3>
                  <p className="text-[#D9DFE7] text-sm">
                    {user.account_type === 'wholesale' ? 'Wholesale Account' : 'Retail Account'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/profile" 
                  className="bg-white text-[#0A1F44] px-6 py-2 rounded-lg font-semibold hover:bg-[#C9A227] hover:text-white transition-all duration-300 flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>My Profile</span>
                </Link>
                <Link 
                  to="/shop" 
                  className="bg-transparent border-2 border-[#C9A227] text-[#C9A227] px-6 py-2 rounded-lg font-semibold hover:bg-[#C9A227] hover:text-white transition-all duration-300 flex items-center space-x-2"
                >
                  <Truck className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-[#C9A227] p-2 rounded-lg">
                <Building className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-[#C9A227] bg-clip-text text-transparent">
                GIVORA
              </span>
            </div>
            <p className="text-[#D9DFE7] text-sm leading-relaxed mb-6">
              Premium institutional supply for hotels, restaurants, and healthcare facilities. 
              Your trusted partner for quality wholesale products.
            </p>
            <div className="flex space-x-4">
              <div className="bg-[#C9A227]/10 p-3 rounded-lg border border-[#C9A227]/20">
                <Shield className="w-5 h-5 text-[#C9A227]" />
              </div>
              <div className="bg-[#C9A227]/10 p-3 rounded-lg border border-[#C9A227]/20">
                <Truck className="w-5 h-5 text-[#C9A227]" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#C9A227] rounded-full"></div>
              <span>Quick Links</span>
            </h3>
            <div className="flex flex-col space-y-4">
              <Link 
                to="/shop" 
                className="text-[#D9DFE7] hover:text-[#C9A227] transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <div className="w-1 h-1 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>Shop Products</span>
              </Link>
              <Link 
                to="/industries" 
                className="text-[#D9DFE7] hover:text-[#C9A227] transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <div className="w-1 h-1 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>Industries We Serve</span>
              </Link>
              <Link 
                to="/about" 
                className="text-[#D9DFE7] hover:text-[#C9A227] transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <div className="w-1 h-1 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>About Us</span>
              </Link>
              <Link 
                to="/wholesale-registration" 
                className="text-[#D9DFE7] hover:text-[#C9A227] transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <div className="w-1 h-1 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>Wholesale Registration</span>
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#C9A227] rounded-full"></div>
              <span>Legal</span>
            </h3>
            <div className="flex flex-col space-y-4">
              <Link 
                to="/terms" 
                className="text-[#D9DFE7] hover:text-[#C9A227] transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <div className="w-1 h-1 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>Terms of Service</span>
              </Link>
              <Link 
                to="/privacy" 
                className="text-[#D9DFE7] hover:text-[#C9A227] transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <div className="w-1 h-1 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>Privacy Policy</span>
              </Link>
              <Link 
                to="/refund-policy" 
                className="text-[#D9DFE7] hover:text-[#C9A227] transition-all duration-300 text-sm flex items-center space-x-2 group"
              >
                <div className="w-1 h-1 bg-[#C9A227] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span>Refund Policy</span>
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-lg mb-6 flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#C9A227] rounded-full"></div>
              <span>Contact Info</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="bg-[#C9A227] p-2 rounded-lg">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[#D9DFE7] text-xs">Email</p>
                  <p className="text-white text-sm font-medium">info@givora.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="bg-[#C9A227] p-2 rounded-lg">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[#D9DFE7] text-xs">Phone</p>
                  <p className="text-white text-sm font-medium">1-800-GIVORA-1</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300">
                <div className="bg-[#C9A227] p-2 rounded-lg">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[#D9DFE7] text-xs">Location</p>
                  <p className="text-white text-sm font-medium">United States</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#D9DFE7]/20 mt-12 pt-8">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#D9DFE7] text-sm text-center md:text-left">
              © 2025 GIVORA. Powered by <span className="text-[#C9A227] font-semibold">GIGI Import</span>. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <button className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Terms
              </button>
              <button className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Privacy
              </button>
              <button className="text-[#D9DFE7] hover:text-[#C9A227] transition-colors text-sm">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;