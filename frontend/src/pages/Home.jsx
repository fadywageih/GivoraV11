import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, 
  Truck, 
  DollarSign, 
  Users, 
  Hotel, 
  Utensils, 
  Heart, 
  Store,
  Shield,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const categories = [
    { name: 'Tissue', icon: '🧻', description: 'Premium quality tissues' },
    { name: 'Paper Towels', icon: '🧻', description: 'Absorbent & durable' },
    { name: 'Gloves', icon: '🧤', description: 'Protective disposable' },
    { name: 'Garbage Bags', icon: '🗑️', description: 'Heavy-duty solutions' },
    { name: 'Underpads', icon: '🛏️', description: 'Healthcare essentials' },
    { name: 'Cups', icon: '🥤', description: 'Disposable drinkware' },
    { name: 'Paper Bags', icon: '🛍️', description: 'Eco-friendly packaging' }
  ];

  const features = [
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'Premium products meeting institutional standards with rigorous quality control.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Truck,
      title: 'Fast Fulfillment',
      description: 'Efficient logistics and reliable delivery to keep your operations running smoothly.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: DollarSign,
      title: 'Bulk Pricing',
      description: 'Competitive wholesale pricing for approved B2B customers with volume discounts.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'B2B Support',
      description: 'Dedicated account management and professional customer service for businesses.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const industries = [
    { 
      icon: Hotel, 
      name: 'Hotels',
      description: 'Hospitality supplies for hotels and resorts',
      count: '500+'
    },
    { 
      icon: Utensils, 
      name: 'Restaurants',
      description: 'Food service essentials for restaurants',
      count: '1200+'
    },
    { 
      icon: Heart, 
      name: 'Healthcare',
      description: 'Medical and healthcare supplies',
      count: '300+'
    },
    { 
      icon: Store, 
      name: 'Markets',
      description: 'Retail and supermarket solutions',
      count: '800+'
    }
  ];

  return (
    <>
      <Helmet>
        <title>GIVORA - Premium Institutional Supply for Hotels, Restaurants & Healthcare</title>
        <meta name="description" content="Delivering excellence to hotels, restaurants and healthcare facilities. Quality institutional supplies with wholesale pricing for approved B2B customers." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0A1F44] via-[#0A1F44] to-[#1E3A8A] text-white py-20 md:py-32 overflow-hidden">
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
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted by Institutions</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Premium{' '}
              <span className="bg-gradient-to-r from-[#C9A227] to-[#E5C158] bg-clip-text text-transparent">
                Institutional
              </span>{' '}
              Supply
            </h1>
            <p className="text-xl md:text-2xl text-[#D9DFE7] mb-8 max-w-3xl mx-auto leading-relaxed">
              Delivering excellence to hotels, restaurants, and healthcare facilities with quality supplies and wholesale pricing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/shop">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#C9A227] to-[#B5941F] hover:from-[#B5941F] hover:to-[#A3851B] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Shop Supplies
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/wholesale-registration">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-[#0A1F44] px-8 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                >
                  Request Wholesale Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#D9DFE7]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0A1F44]">
              Product <span className="text-[#C9A227]">Categories</span>
            </h2>
            <p className="text-lg text-[#0A1F44]/70 max-w-2xl mx-auto">
              Explore our comprehensive range of institutional supplies designed for professional use
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-[#D9DFE7] hover:border-[#C9A227]/30 hover:transform hover:-translate-y-2"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-[#0A1F44] mb-1 text-sm">{category.name}</h3>
                <p className="text-xs text-[#0A1F44]/60 hidden group-hover:block transition-all duration-300">
                  {category.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0A1F44]">
              Why Choose <span className="text-[#C9A227]">GIVORA</span>?
            </h2>
            <p className="text-lg text-[#0A1F44]/70 max-w-2xl mx-auto">
              We provide comprehensive solutions for institutional supply needs with professional service and competitive pricing.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#D9DFE7] group-hover:border-[#C9A227]/30 h-full">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-[#0A1F44]">{feature.title}</h3>
                  <p className="text-[#0A1F44]/70 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gradient-to-br from-[#0A1F44]/5 to-[#C9A227]/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#0A1F44]">
              Trusted By <span className="text-[#C9A227]">Industry Leaders</span>
            </h2>
            <p className="text-lg text-[#0A1F44]/70 max-w-2xl mx-auto">
              Serving thousands of businesses across multiple industries with reliable institutional supplies
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#D9DFE7] hover:border-[#C9A227]/30 hover:transform hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-[#0A1F44] to-[#0A1F44]/90 p-4 rounded-2xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300">
                  <industry.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A1F44] mb-2">{industry.name}</h3>
                <div className="text-3xl font-bold text-[#C9A227] mb-2">{industry.count}</div>
                <p className="text-[#0A1F44]/70 text-sm">{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0A1F44] to-[#1E3A8A] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-xl text-[#D9DFE7] mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied institutions that trust GIVORA for their supply needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button 
                  size="lg" 
                  className="bg-[#C9A227] hover:bg-[#B5941F] text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Shopping Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white hover:bg-white hover:text-[#0A1F44] px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;