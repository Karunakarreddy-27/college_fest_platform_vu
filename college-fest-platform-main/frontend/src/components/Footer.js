import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Calendar,
  Users,
  Trophy
} from 'lucide-react';

const MotionRouterLink = motion(Link);

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    QuickLinks: [
      { name: 'About Us', href: '#about' },
      { name: 'Events', href: '/events' },
      { name: 'Gallery', href: '/gallery' },
      { name: 'Contact', href: '/contact' },
    ],
    Events: [
      { name: 'Sports', href: '/events?category=Sports' },
      { name: 'Games', href: '/events?category=Games' },
      { name: 'Athletics', href: '/events?category=Athletics' },
      { name: 'All Events', href: '/events' },
    ],
    Support: [
      { name: 'FAQ', href: '/support/faq' },
      { name: 'Terms & Conditions', href: '/support/terms' },
      { name: 'Privacy Policy', href: '/support/privacy' },
      { name: 'Help Center', href: '/support/help-center' },
    ],
  };

  const socialLinks = [
    { label: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/share/1JPR5VZg5X/', color: 'hover:text-blue-400' },
    { label: 'Twitter', icon: Twitter, href: 'https://x.com/VFSTR_Vignan', color: 'hover:text-blue-300' },
    { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/vcode.cse_2k26?igsh=MTUwanVhOW9jNzNybA==', color: 'hover:text-pink-400' },
    { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/vignan-s-foundation-of-science-technology-research/?originalSubdomain=in', color: 'hover:text-blue-500' },
  ];

  const stats = [
    { icon: Calendar, label: '3 Days', value: 'Event Duration' },
    { icon: Users, label: '5000+', value: 'Expected Participants' },
    { icon: Trophy, label: '50+', value: 'Events & Competitions' },
  ];

  return (
    <footer className="relative bg-dark-card border-t border-dark-border mt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-bg/50" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12 border-b border-dark-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center space-x-4 glass rounded-lg p-6 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-12">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-2xl font-bold gradient-text">TechFest 2026</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Join us for the most futuristic college fest experience with cutting-edge technology, 
              amazing events, and unforgettable memories. Where innovation meets celebration!
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.label === 'Instagram' || social.label === 'Facebook' || social.label === 'Twitter' || social.label === 'LinkedIn' ? '_blank' : undefined}
                  rel={social.label === 'Instagram' || social.label === 'Facebook' || social.label === 'Twitter' || social.label === 'LinkedIn' ? 'noopener noreferrer' : undefined}
                  aria-label={social.label}
                  className={`w-10 h-10 glass rounded-full flex items-center justify-center text-gray-400 transition-colors ${social.color}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('http') || link.href.startsWith('#') ? (
                      <motion.a
                        href={link.href}
                        className="text-gray-400 hover:text-neon-blue transition-colors duration-300"
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                      </motion.a>
                    ) : (
                      <MotionRouterLink
                        to={link.href}
                        className="text-gray-400 hover:text-neon-blue transition-colors duration-300 inline-block"
                        whileHover={{ x: 5 }}
                      >
                        {link.name}
                      </MotionRouterLink>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          className="glass rounded-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold text-white mb-6 text-center">Get in Touch</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Email</div>
                <div className="text-white">info@techfest2026.com</div>
              </div>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-neon-purple/20 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-neon-purple" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Phone</div>
                <div className="text-white">+91 80195 48729</div>
              </div>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-neon-pink/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-neon-pink" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Location</div>
                <div className="text-white">Vignan University</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="border-t border-dark-border py-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400">
            {currentYear} VCode 2026. All rights reserved. | 
            Made by VCode Team
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
