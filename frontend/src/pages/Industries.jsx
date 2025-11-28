import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Hotel, Utensils, Heart, Store, CheckCircle } from 'lucide-react';

const Industries = () => {
  const industries = [
    {
      icon: Hotel,
      name: 'Hotels & Hospitality',
      description: 'Premium supplies for guest rooms, housekeeping, and front-of-house operations. From luxury linens to essential amenities, we provide comprehensive solutions for hospitality excellence.',
      features: [
        'Guest room amenities and toiletries',
        'Housekeeping supplies and equipment',
        'Laundry and cleaning products',
        'Front desk and concierge materials'
      ],
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Utensils,
      name: 'Restaurants & Food Service',
      description: 'Food-safe products and disposables for commercial kitchens, dining areas, and takeout services. Maintain hygiene standards while delivering exceptional service to your customers.',
      features: [
        'Food preparation and storage supplies',
        'Disposable tableware and containers',
        'Kitchen cleaning and sanitation',
        'Takeout packaging solutions'
      ],
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Heart,
      name: 'Healthcare & Clinics',
      description: 'Medical-grade supplies meeting strict healthcare standards. Support patient care and facility operations with reliable, quality products designed for medical environments.',
      features: [
        'Patient care supplies and underpads',
        'Medical-grade gloves and PPE',
        'Infection control products',
        'Facility maintenance supplies'
      ],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Store,
      name: 'Retail & Markets',
      description: 'Essential supplies for retail operations, from checkout to stockroom. Enhance customer experience and streamline operations with our comprehensive product range.',
      features: [
        'Shopping bags and packaging',
        'Cleaning and maintenance supplies',
        'Break room and restroom products',
        'Point-of-sale materials'
      ],
      image: 'https://images.unsplash.com/photo-1563017256-6c4b9adc63c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Industries We Serve - GIVORA</title>
        <meta name="description" content="GIVORA serves hotels, restaurants, healthcare facilities, and retail markets with premium institutional supplies and dedicated B2B support." />
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              Industries <span className="bg-gradient-to-r from-[#C9A227] to-[#E5C158] bg-clip-text text-transparent">We Serve</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#D9DFE7] mb-8 leading-relaxed">
              Comprehensive supply solutions tailored to the unique needs of your industry
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#D9DFE7]/20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-[#D9DFE7] ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } flex flex-col lg:flex-row`}
              >
                {/* Image Section */}
                <div className="lg:w-1/2 relative overflow-hidden group">
                  <img
                    src={industry.image}
                    alt={industry.name}
                    className="w-full h-64 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <industry.icon className="w-8 h-8 text-[#0A1F44]" />
                  </div>
                </div>

                {/* Content Section */}
                <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-2 bg-[#C9A227]/10 text-[#C9A227] px-4 py-2 rounded-full text-sm font-semibold">
                      <industry.icon className="w-4 h-4" />
                      {industry.name.split(' & ')[0]}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-[#0A1F44] mb-6 leading-tight">
                    {industry.name}
                  </h2>
                  
                  <p className="text-[#0A1F44]/80 mb-8 leading-relaxed text-lg">
                    {industry.description}
                  </p>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-[#0A1F44] text-lg">What We Provide:</h3>
                    <div className="grid gap-3">
                      {industry.features.map((feature, featureIndex) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: featureIndex * 0.1 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#0A1F44]/5 transition-colors duration-300"
                        >
                          <div className="bg-[#C9A227] p-2 rounded-full flex-shrink-0 mt-1">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[#0A1F44]/80 font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-8 pt-6 border-t border-[#D9DFE7]">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#C9A227]">500+</div>
                        <div className="text-sm text-[#0A1F44]/60">Clients</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#C9A227]">50+</div>
                        <div className="text-sm text-[#0A1F44]/60">Products</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#C9A227]">24/7</div>
                        <div className="text-sm text-[#0A1F44]/60">Support</div>
                      </div>
                    </div>
                  </div>
                </div>
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
              Join thousands of satisfied businesses that trust GIVORA for their institutional supply needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#C9A227] hover:bg-[#B5941F] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-[#0A1F44] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300">
                Contact Our Team
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Industries;