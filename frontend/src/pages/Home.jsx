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
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const mainCategories = [
    {
      title: 'Hotels & Hospitality',
      icon: Hotel,
      color: 'from-blue-600 to-purple-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-purple-50',
      description: 'Premium supplies for hotels, resorts, and accommodation facilities',
      subcategories: [
        {
          name: 'Tissue',
          image: 'https://industry.pulpandpaper-technology.com/suppliers/sertec20/products/tissue-lg.jpg',
          description: 'Premium quality tissues'
        },
        {
          name: 'Garbage Bags',
          image: 'https://tse4.mm.bing.net/th/id/OIP.vizSPy1VmO6rgiF4PPptvAHaFI?rs=1&pid=ImgDetMain&o=7&rm=3',
          description: 'Heavy-duty trash bags'
        },
        {
          name: 'Cups',
          image: 'https://img.freepik.com/premium-photo/large-collection-cups-cups-are-displayed-store_948735-225162.jpg',
          description: 'Disposable plastic cups'
        }
      ]
    },
    {
      title: 'Food Service',
      icon: Utensils,
      color: 'from-orange-600 to-red-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      description: 'Essential supplies for restaurants, cafes, and catering',
      subcategories: [
        {
          name: 'Cups',
          image: 'https://img.freepik.com/premium-photo/large-collection-cups-cups-are-displayed-store_948735-225162.jpg',
          description: 'Disposable plastic cups'
        },
        {
          name: 'Paper Bags',
          image: 'https://tse2.mm.bing.net/th/id/OIP.Sn1f8jQdqN0GKlT6KjP5KAHaGE?rs=1&pid=ImgDetMain&o=7&rm=3',
          description: 'Takeout packaging bags'
        },
        {
          name: 'Garbage Bags',
          image: 'https://tse4.mm.bing.net/th/id/OIP.vizSPy1VmO6rgiF4PPptvAHaFI?rs=1&pid=ImgDetMain&o=7&rm=3',
          description: 'Commercial grade trash bags'
        },
        {
          name: 'Gloves',
          image: 'https://tse2.mm.bing.net/th/id/OIP.wfiZ2E7xxKQbSqOaerQoeQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
          description: 'Food safe disposable gloves'
        },
        {
          name: 'Paper Towels',
          image: 'https://th.bing.com/th/id/R.47c48cdb3abd0d8819e878f744048dd0?rik=QUhliV%2bqJy9f%2fA&pid=ImgRaw&r=0',
          description: 'Absorbent paper towels'
        },
        {
          name: 'Tissue',
          image: 'https://industry.pulpandpaper-technology.com/suppliers/sertec20/products/tissue-lg.jpg',
          description: 'Premium quality tissue paper'
        }
      ]
    },
    {
      title: 'Healthcare',
      icon: Heart,
      color: 'from-green-600 to-teal-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-teal-50',
      description: 'Medical grade supplies for healthcare facilities',
      subcategories: [
        {
          name: 'Gloves',
          image: 'https://tse2.mm.bing.net/th/id/OIP.wfiZ2E7xxKQbSqOaerQoeQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
          description: 'Medical grade disposable gloves'
        },
        {
          name: 'Underpads',
          image: 'https://tse4.mm.bing.net/th/id/OIP.duofSD2WS8E8tSOSxuTG5gHaGx?rs=1&pid=ImgDetMain&o=7&rm=3',
          description: 'Medical bed underpads'
        },
        {
          name: 'Wet Wipes',
          image: 'https://tse1.mm.bing.net/th/id/OIP.5UmAB9syt1tR98ad-rGkbgHaDS?rs=1&pid=ImgDetMain&o=7&rm=3',
          description: 'Medical wet wipes'
        }
      ]
    }
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
  className="border-2 border-[#C9A227] text-[#C9A227] hover:bg-[#C9A227] hover:text-white px-8 py-3 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
>
  Request Wholesale Account
</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
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
              Industry <span className="text-[#C9A227]">Solutions</span>
            </h2>
            <p className="text-lg text-[#0A1F44]/70 max-w-2xl mx-auto">
              Tailored supplies for different institutional needs with specialized expertise
            </p>
          </motion.div>

          {/* Main Categories Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {mainCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                {/* Main Category Card */}
                <div className={`${category.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:border-gray-200 h-full`}>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color}`}>
                        <category.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#0A1F44]">{category.title}</h3>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#C9A227] group-hover:translate-x-2 transition-all duration-300" />
                  </div>
                  <p className="text-gray-600 mb-8">{category.description}</p>
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">Available Products</h4>
                    <div className={`grid ${category.subcategories.length === 3 ? 'grid-cols-3' : 'grid-cols-3'} gap-3`}>
                      {category.subcategories.map((sub, i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
                        >
                          <div className="h-20 overflow-hidden bg-gray-100">
                            <img
                              src={sub.image}
                              alt={sub.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="p-2 text-center">
                            <div className="text-xs font-medium text-gray-800 truncate">{sub.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link to="/shop">
                    <Button
                      className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white font-semibold`}
                      size="lg"
                    >
                      View {category.title} Supplies
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#0A1F44]/5 to-[#C9A227]/5 rounded-3xl p-8"
          >
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
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
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group-hover:border-[#C9A227]/30 h-full">
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
                className="group bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#C9A227]/30 hover:transform hover:-translate-y-2"
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