import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Trophy, 
  ArrowRight,
  Star,
  Zap,
  Target,
  Rocket,
  Sparkles
} from 'lucide-react';

const LandingPage = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const { theme } = useTheme();

  useEffect(() => {
    // Set fest date to April 11th 2026
    const festDate = new Date('2026-04-21T00:00:00');

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = festDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'High-Speed Events',
      description: 'Experience adrenaline-pumping competitions and challenges'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Precision Sports',
      description: 'Test your skills in carefully crafted athletic competitions'
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: 'Innovation Showcase',
      description: 'Witness cutting-edge technology and creative exhibitions'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Cultural Extravaganza',
      description: 'Immerse yourself in vibrant cultural performances'
    }
  ];

  const eventHighlights = [
    {
      category: 'Sports',
      events: ['Cricket', 'Football', 'Volleyball', 'Kabaddi'],
      color: 'from-neon-blue to-cyan-500'
    },
    {
      category: 'Games',
      events: ['Chess', 'Table Tennis', 'Badminton'],
      color: 'from-neon-purple to-purple-500'
    },
    {
      category: 'Athletics',
      events: ['100m Race', 'Long Jump', 'Shot Put', 'Relay Race'],
      color: 'from-neon-pink to-pink-500'
    }
  ];

  const sponsors = [
    { name: 'TechCorp', tier: 'Platinum' },
    { name: 'InnovateLab', tier: 'Gold' },
    { name: 'DigitalFuture', tier: 'Silver' },
    { name: 'CloudSystems', tier: 'Bronze' },
    { name: 'DataFlow', tier: 'Bronze' },
    { name: 'CyberSecure', tier: 'Silver' }
  ];

  const testimonials = [
    {
      name: 'Rahul Sharma',
      role: 'Previous Winner',
      content: 'The most well-organized college fest I\'ve ever participated in. Amazing events and great management!',
      rating: 5
    },
    {
      name: 'Priya Patel',
      role: 'Participant 2023',
      content: 'TechFest pushed me to explore my limits and discover new talents. Can\'t wait for this year!',
      rating: 5
    },
    {
      name: 'Amit Kumar',
      role: 'Event Coordinator',
      content: 'A perfect blend of technology, sports, and culture. The energy is absolutely electric!',
      rating: 5
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary" />
        
        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Logo */}
          <motion.div
            className="mb-8 inline-block"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-5xl animate-pulse">V</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6 gradient-text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            VCode 2026
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-themed-secondary mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Where Code Meets Innovation • 3 Days of Pure Excellence
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { label: 'Days', value: timeLeft.days || 0 },
              { label: 'Hours', value: timeLeft.hours || 0 },
              { label: 'Minutes', value: timeLeft.minutes || 0 },
              { label: 'Seconds', value: timeLeft.seconds || 0 }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="glass rounded-lg p-4 text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text">
                  {String(item.value).padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-400 mt-1">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link
              to="/signup"
              className="group px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-full font-semibold text-lg btn-glow flex items-center space-x-2"
            >
              <span>Register Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/events"
              className="px-8 py-4 glass rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              Explore Events
            </Link>
          </motion.div>

          {/* Event Info */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { icon: <Calendar className="w-5 h-5" />, text: 'April 15-17, 2026' },
              { icon: <MapPin className="w-5 h-5" />, text: 'Vignan University' },
              { icon: <Users className="w-5 h-5" />, text: '5000+ Participants' }
            ].map((info, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-center space-x-2 text-gray-300"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-neon-blue">{info.icon}</div>
                <span>{info.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Why TechFest 2026?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of college festivals with cutting-edge events and unforgettable moments
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-6 text-center card-hover"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Event Categories
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover amazing events across different categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {eventHighlights.map((category, index) => (
              <motion.div
                key={category.category}
                className="glass rounded-xl p-8 card-hover"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 mb-6 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center`}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{category.category}</h3>
                <div className="space-y-2">
                  {category.events.map((event) => (
                    <div key={event} className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-neon-blue rounded-full" />
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/events"
                  className="mt-6 inline-flex items-center space-x-2 text-neon-blue hover:text-neon-purple transition-colors"
                >
                  <span>View All Events</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              What People Say
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Hear from our previous participants and winners
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Our Sponsors
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Proudly supported by industry leaders
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {sponsors.map((sponsor, index) => (
              <motion.div
                key={index}
                className="glass rounded-lg p-6 text-center card-hover"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`text-sm font-semibold mb-2 ${
                  sponsor.tier === 'Platinum' ? 'text-gray-300' :
                  sponsor.tier === 'Gold' ? 'text-yellow-400' :
                  sponsor.tier === 'Silver' ? 'text-gray-400' :
                  'text-orange-600'
                }`}>
                  {sponsor.tier}
                </div>
                <div className="text-white font-bold">{sponsor.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="glass rounded-2xl p-12 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Ready to Join the Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Don't miss out on the biggest college fest of the year. Register now and be part of something extraordinary!
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-full font-semibold text-lg btn-glow"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
