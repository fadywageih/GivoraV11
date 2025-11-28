import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Eye, EyeOff, Lock, User, ChevronDown } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, register, verifyEmail } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'retail',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast({
        title: "Google Login Successful",
        description: "Welcome to GIVORA!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleVerify = async () => {
    if (!verificationEmail || !verificationCode) {
      toast({
        title: "Error",
        description: "Please enter both email and verification code.",
        variant: "destructive"
      });
      return;
    }
    try {
      console.log(verificationEmail, verificationCode);
      const success = await verifyEmail(verificationEmail, verificationCode);
      if (success) {
        toast({
          title: "Email Verified",
          description: "You can now log in.",
        });
        setShowVerification(false);
        setIsLogin(true);
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid email or verification code.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Login Successful",
          description: "Welcome back to GIVORA.",
        });
        navigate('/');
      } else {
        // Registration
        await register(formData);
        setVerificationEmail(formData.email);
        setShowVerification(true);
        toast({
          title: "Registration Successful",
          description: "Please verify your email address to continue.",
        });
      }
    } catch (error) {
      toast({
        title: isLogin ? "Login Failed" : "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (showVerification) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0A1F44]/5 to-[#C9A227]/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center border border-[#D9DFE7]"
        >
          <div className="mx-auto bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-md">
            <Mail className="w-10 h-10 text-[#C9A227]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A1F44] mb-4">Verify Your Email</h2>
          <p className="text-[#0A1F44]/70 mb-6">
            We've sent a verification code to <strong>{verificationEmail}</strong>.
          </p>
          <div className="relative mb-6">
            <input 
              placeholder="Enter 6-digit code" 
              type="text" 
              className="w-full p-4 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] text-center text-lg tracking-widest font-medium" 
              value={verificationCode} 
              maxLength={6} 
              onChange={(e) => setVerificationCode(e.target.value)} 
            />
          </div>
          <Button 
            onClick={handleVerify} 
            className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Verify & Continue
          </Button>
          <p className="text-xs text-[#0A1F44]/50 mt-4">
            Didn't receive the code? <button className="text-[#C9A227] hover:underline">Resend</button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isLogin ? 'Login' : 'Register'} - GIVORA</title>
        <meta name="description" content="Secure login for GIVORA institutional accounts." />
      </Helmet>

      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0A1F44]/5 to-[#C9A227]/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#D9DFE7]"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#0A1F44] mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-[#0A1F44]/60">
              {isLogin ? 'Sign in to your GIVORA account' : 'Join GIVORA today'}
            </p>
          </div>

          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border-[#D9DFE7] hover:bg-gray-50 py-3 rounded-xl transition-all duration-300 hover:shadow-sm"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Button>
            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#D9DFE7]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-[#0A1F44]/50">Or continue with email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                    <input 
                      type="text" 
                      name="first_name" 
                      value={formData.first_name} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300" 
                      placeholder="John"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                    <input 
                      type="text" 
                      name="last_name" 
                      value={formData.last_name} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-10 pr-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300" 
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 hover:text-[#0A1F44] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-12 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      placeholder="••••••••"
                    />
                    <button 
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 hover:text-[#0A1F44] transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                    Account Type
                  </label>
                  <div className="relative">
                    <select
                      name="accountType"
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] appearance-none transition-all duration-300 bg-white"
                    >
                      <option value="retail">Retail B2B</option>
                      {/* <option value="wholesale">Wholesale B2B (Requires Approval)</option> */}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4 pointer-events-none" />
                  </div>
                  {formData.accountType === 'wholesale' && (
                    <p className="text-xs text-[#C9A227] mt-2">
                      Wholesale accounts require approval before activation
                    </p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300 mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#C9A227] hover:text-[#C9A227]/80 hover:underline transition-colors text-sm font-medium block w-full"
            >
              {isLogin ? 'Need an account? Register here' : 'Already have an account? Sign in here'}
            </button>
            {isLogin && (
              <Link to="/forgot-password">
                <button className="text-[#0A1F44]/60 hover:text-[#0A1F44] text-sm underline transition-colors">
                  Forgot Password?
                </button>
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;