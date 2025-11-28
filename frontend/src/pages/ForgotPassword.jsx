import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { requestPasswordReset, resetPassword } = useAuth();
  const { toast } = useToast();
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      requestPasswordReset(email);
      setSubmitted(true);
      toast({
        title: "Reset Link Sent",
        description: "Check your email for the password reset link.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    try {
      if (newPassword !== confirmNewPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        return;
      }

      resetPassword(resetToken, newPassword);
      setSubmitted(true);
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset successfully.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    finally {
      navigate('/login');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0A1F44]/5 to-[#C9A227]/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#D9DFE7]"
        >
          <div className="text-center mb-6">
            <div className="mx-auto bg-gradient-to-br from-green-100 to-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Shield className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#0A1F44] mb-2">Reset Your Password</h2>
            <p className="text-[#0A1F44]/60 text-sm">
              Enter the reset token and your new password
            </p>
          </div>

          <div className="space-y-5 mb-6">
            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                Reset Token
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Enter reset token from email" 
                  value={resetToken} 
                  onChange={(e) => setResetToken(e.target.value)} 
                  className="w-full pl-10 pr-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  placeholder="Enter new password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="w-full pl-10 pr-12 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 hover:text-[#0A1F44] transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirm new password" 
                  value={confirmNewPassword} 
                  onChange={(e) => setConfirmNewPassword(e.target.value)} 
                  className="w-full pl-10 pr-12 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
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
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleReset} 
              className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Reset Password
            </Button>
            <Link to="/login">
              <Button 
                variant="outline" 
                className="w-full border-[#D9DFE7] text-[#0A1F44] hover:bg-[#0A1F44]/5 py-3 rounded-xl transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - GIVORA</title>
        <meta name="description" content="Reset your GIVORA account password" />
      </Helmet>
      
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16 px-4 bg-gradient-to-br from-[#0A1F44]/5 to-[#C9A227]/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#D9DFE7]"
        >
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-[#C9A227]/20 to-[#C9A227]/10 w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-md">
              <Mail className="w-10 h-10 text-[#C9A227]" />
            </div>
            <h1 className="text-2xl font-bold text-[#0A1F44] mb-2">Forgot Password?</h1>
            <p className="text-[#0A1F44]/60 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0A1F44] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0A1F44]/40 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 text-white py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-[#0A1F44]/60 hover:text-[#0A1F44] hover:underline transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPassword;