import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, Users, DollarSign, Truck, Shield, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { wholesaleAPI } from '@/lib/api';

const WholesaleRegistration = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    einNumber: '',
    businessType: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to your account before applying.",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await wholesaleAPI.apply(formData);

      if (response.success) {
        toast({
          title: "Application Submitted",
          description: "Thank you for your interest. Our team will review your application and contact you within 2-3 business days.",
        });

        setFormData({
          businessName: '',
          einNumber: '',
          businessType: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: ''
        });
      }
    } catch (error) {
      console.error('Wholesale application error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your application.",
        variant: "destructive"
      });
    }
  };

  const benefits = [
    {
      icon: DollarSign,
      title: 'Wholesale Pricing',
      description: 'Access to exclusive B2B pricing tiers and volume discounts'
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Personalized account management and priority customer service'
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Priority order processing and reliable delivery options'
    },
    {
      icon: Shield,
      title: 'Flexible Terms',
      description: 'Customized payment solutions and credit options'
    }
  ];

  const requirements = [
    'Valid EIN Number',
    'Business License',
    'Physical Business Address',
    'Tax-Exempt Certificate (if applicable)',
    'Minimum Order: $500',
    'US-Based Business'
  ];

  return (
    <>
      <Helmet>
        <title>Wholesale Registration - GIVORA</title>
        <meta name="description" content="Apply for a GIVORA wholesale account to access special B2B pricing and benefits." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#1E3A8A] text-white py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
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
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20"
            >
              <Building2 className="w-5 h-5" />
              <span className="text-sm font-medium">B2B Wholesale Program</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Wholesale <span className="bg-gradient-to-r from-[#C9A227] to-[#E5C158] bg-clip-text text-transparent">Registration</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#D9DFE7] mb-8 leading-relaxed">
              Unlock exclusive pricing and benefits for your business
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#D9DFE7]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#0A1F44]">
              Why Join Our <span className="text-[#C9A227]">Wholesale Program</span>?
            </h2>
            <p className="text-lg text-[#0A1F44]/70 max-w-2xl mx-auto">
              Access exclusive benefits designed to help your business grow and save
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#D9DFE7] group-hover:border-[#C9A227]/30 h-full text-center group-hover:transform group-hover:-translate-y-2">
                  <div className="bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 p-4 rounded-2xl inline-block mb-6 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1F44] mb-4">{benefit.title}</h3>
                  <p className="text-[#0A1F44]/70 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Sidebar - Benefits & Requirements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-8"
            >
              {/* Benefits Card */}
              <div className="bg-gradient-to-br from-[#0A1F44] to-[#0A1F44]/90 rounded-2xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#C9A227] p-2 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Program Benefits</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <span className="text-white/90">Access to wholesale pricing tiers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <span className="text-white/90">Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <span className="text-white/90">Volume discount opportunities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <span className="text-white/90">Priority order processing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <span className="text-white/90">Flexible payment terms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#C9A227] flex-shrink-0" />
                    <span className="text-white/90">Customized product solutions</span>
                  </div>
                </div>
              </div>

              {/* Requirements Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#D9DFE7]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#C9A227] p-2 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0A1F44]">Requirements</h2>
                </div>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={requirement} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#C9A227] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-[#0A1F44]/80 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#D9DFE7]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#C9A227] p-2 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-[#0A1F44]">Approval Process</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0A1F44] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                    <span className="text-[#0A1F44]/80 text-sm">Submit Application</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0A1F44] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                    <span className="text-[#0A1F44]/80 text-sm">Document Review (1-2 days)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-[#0A1F44] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                    <span className="text-[#0A1F44]/80 text-sm">Account Activation</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-[#D9DFE7]">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-[#0A1F44] mb-3">
                    Business Application
                  </h2>
                  <p className="text-[#0A1F44]/70">
                    Complete the form below to apply for wholesale pricing. Our team will review your application within 2-3 business days.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      placeholder="Your official business name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                        EIN Number *
                      </label>
                      <input
                        type="text"
                        name="einNumber"
                        value={formData.einNumber}
                        onChange={handleChange}
                        required
                        placeholder="XX-XXXXXXX"
                        className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                        Business Type *
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300 bg-white"
                      >
                        <option value="">Select Business Type</option>
                        <option value="hotel">Hotel & Hospitality</option>
                        <option value="restaurant">Restaurant & Food Service</option>
                        <option value="healthcare">Healthcare & Medical</option>
                        <option value="retail">Retail & Markets</option>
                        <option value="other">Other Business</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      placeholder="Your business phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                      Business Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      placeholder="Street address"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                        placeholder="State"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                        placeholder="ZIP Code"
                      />
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 hover:from-[#C9A227] hover:to-[#B5941F] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Submit Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WholesaleRegistration;