import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Building2, Award, Users, TrendingUp, Shield, Truck, Globe, Heart } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'We never compromise on product quality, ensuring every item meets institutional standards.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Dedicated support and personalized service for every B2B customer relationship.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'Reliability',
      description: 'Consistent supply chain and on-time delivery you can depend on.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Building2,
      title: 'Industry Expertise',
      description: 'Deep understanding of institutional supply needs across multiple sectors.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { number: '2,800+', label: 'Satisfied Clients', icon: Users },
    { number: '50K+', label: 'Products Delivered', icon: Truck },
    { number: '99%', label: 'Customer Satisfaction', icon: Heart },
    { number: '24/7', label: 'Support Available', icon: Shield }
  ];

  return (
    <>
      <Helmet>
        <title>About GIVORA - Premium Institutional Supply</title>
        <meta name="description" content="Learn about GIVORA, powered by GIGI Import. We deliver premium institutional supplies to hotels, restaurants, healthcare facilities, and retail markets." />
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
              <span className="text-sm font-medium">Powered by GIGI Import</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              About <span className="bg-gradient-to-r from-[#C9A227] to-[#E5C158] bg-clip-text text-transparent">GIVORA</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#D9DFE7] mb-8 leading-relaxed">
              Excellence in institutional supply since our founding
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-white to-[#D9DFE7]/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#D9DFE7] group-hover:border-[#C9A227]/30">
                  <div className="bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 p-3 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#0A1F44] mb-2">{stat.number}</div>
                  <div className="text-sm text-[#0A1F44]/60 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#0A1F44]">
                Our <span className="text-[#C9A227]">Story</span>
              </h2>
              <p className="text-lg text-[#0A1F44]/70 max-w-3xl mx-auto">
                Building trust through quality and reliability in institutional supply
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <p className="text-lg text-[#0A1F44]/80 leading-relaxed">
                  <strong className="text-[#0A1F44] font-semibold">GIVORA</strong> is a premier institutional supply company dedicated to serving the unique needs of hotels, restaurants, healthcare facilities, and retail markets. Powered by <strong className="text-[#C9A227] font-semibold">GIGI Import</strong>, we leverage extensive industry experience and robust supply chain capabilities to deliver exceptional products and service to our B2B customers.
                </p>
                <p className="text-lg text-[#0A1F44]/80 leading-relaxed">
                  Our commitment goes beyond simply providing products. We understand the critical role that reliable, high-quality supplies play in your daily operations. That is why we have built our business on the foundation of quality assurance, competitive pricing, and responsive customer support.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-gradient-to-br from-[#0A1F44]/5 to-[#C9A227]/5 rounded-2xl p-8 border border-[#D9DFE7]">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-gradient-to-r from-[#C9A227] to-[#B5941F] p-3 rounded-lg">
                        <Building2 className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0A1F44]">GIGI Import Partnership</h3>
                        <p className="text-[#0A1F44]/60">Established Supplier Network</p>
                      </div>
                    </div>
                    <p className="text-[#0A1F44]/70">
                      Leveraging decades of import expertise to bring you the best products at competitive prices with reliable delivery.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-[#0A1F44]/5 to-[#C9A227]/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[#0A1F44]">
              Our <span className="text-[#C9A227]">Values</span>
            </h2>
            <p className="text-lg text-[#0A1F44]/70 max-w-2xl mx-auto">
              The principles that guide everything we do and every relationship we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#D9DFE7] group-hover:border-[#C9A227]/30 h-full flex flex-col items-center text-center group-hover:transform group-hover:-translate-y-2">
                  <div className={`bg-gradient-to-r ${value.color} p-4 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1F44] mb-4">{value.title}</h3>
                  <p className="text-[#0A1F44]/70 leading-relaxed flex-grow">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GIGI Import Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-gradient-to-br from-[#0A1F44] to-[#0A1F44]/90 rounded-2xl p-12 text-white">
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-white/20">
                <Globe className="w-5 h-5" />
                <span className="font-medium">Global Reach, Local Service</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Powered by <span className="text-[#C9A227]">GIGI Import</span>
              </h2>
              
              <p className="text-lg text-[#D9DFE7] mb-8 leading-relaxed max-w-3xl mx-auto">
                As part of the GIGI Import family, GIVORA benefits from established supplier relationships, efficient logistics networks, and proven business practices. This partnership enables us to offer competitive wholesale pricing, maintain consistent product availability, and provide the level of service that institutional customers require and deserve.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C9A227] mb-2">Global</div>
                  <div className="text-[#D9DFE7] text-sm">Supplier Network</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C9A227] mb-2">Efficient</div>
                  <div className="text-[#D9DFE7] text-sm">Logistics</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#C9A227] mb-2">Proven</div>
                  <div className="text-[#D9DFE7] text-sm">Business Practices</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;