import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { contactAPI } from '@/lib/api';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await contactAPI.submit(formData);

      if (response.success) {
        toast({
          title: "Message Sent",
          description: "Thank you for contacting us. We will respond within 24 business hours.",
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'info@givora.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '1-800-GIVORA-1',
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: MapPin,
      title: 'Location',
      content: 'United States',
      description: 'Nationwide shipping available'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Fri: 9AM-6PM EST',
      description: 'Weekend: Closed'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact & Support - GIVORA</title>
        <meta name="description" content="Get in touch with GIVORA for product inquiries, wholesale account questions, or customer support. We are here to help." />
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
              Contact <span className="bg-gradient-to-r from-[#C9A227] to-[#E5C158] bg-clip-text text-transparent">Support</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#D9DFE7] mb-8 leading-relaxed">
              We are here to assist with your institutional supply needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              {/* WhatsApp Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <a
                  href="https://wa.me/17328164444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-green-400">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-white/20 p-3 rounded-xl">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">Chat on WhatsApp</h3>
                        <p className="text-green-100">Instant support</p>
                      </div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold mb-1">+1 (732) 816-4444</p>
                      <p className="text-green-100 text-sm">Click to start conversation</p>
                    </div>
                  </div>
                </a>
              </motion.div>

              {/* Contact Info Cards */}
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-[#D9DFE7] hover:border-[#C9A227]/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 p-3 rounded-xl">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0A1F44] mb-1 text-lg">{info.title}</h3>
                      <p className="text-[#0A1F44] font-medium mb-1">{info.content}</p>
                      <p className="text-sm text-[#0A1F44]/60">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-[#D9DFE7]">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#0A1F44] mb-3">
                  Send Us a Message
                </h2>
                <p className="text-[#0A1F44]/70">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                      placeholder="Your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300 bg-white"
                    >
                      <option value="">Select Subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="wholesale">Wholesale Account</option>
                      <option value="product">Product Question</option>
                      <option value="order">Order Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A1F44] mb-3">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-[#D9DFE7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] transition-all duration-300"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-[#0A1F44] to-[#0A1F44]/90 hover:from-[#C9A227] hover:to-[#B5941F] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Send Message
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick Support Section */}
      <section className="bg-gradient-to-r from-[#0A1F44]/5 to-[#C9A227]/5 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0A1F44] mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-lg text-[#0A1F44]/70 mb-8">
              For urgent matters, we recommend using WhatsApp for the fastest response time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/17328164444"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat on WhatsApp
                </Button>
              </a>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Contact;