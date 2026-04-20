import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Calendar,
  Shield,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowProfile(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass-themed py-2' : 'glass-themed py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-themed-primary font-bold text-xl">V</span>
              </motion.div>
              <span className="text-2xl font-bold gradient-text">VCode 2026</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-3 py-2 transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'text-neon-blue'
                      : 'text-themed-secondary hover:text-themed-primary'
                  }`}
                >
                  {item.name}
                  {isActivePath(item.path) && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowProfile(!showProfile)}
                    className="flex items-center space-x-2 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user?.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                      showProfile ? 'rotate-180' : ''
                    }`} />
                  </motion.button>

                  <AnimatePresence>
                    {showProfile && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 glass-dark rounded-lg shadow-xl"
                      >
                        <div className="py-2">
                          <Link
                            to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                            onClick={() => setShowProfile(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            {user?.role === 'admin' ? <Shield className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                            <span>{user?.role === 'admin' ? 'Payment Requests' : 'Dashboard'}</span>
                          </Link>
                          {user?.role === 'admin' && (
                            <Link
                              to="/admin"
                              onClick={() => setShowProfile(false)}
                              className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <Shield className="w-4 h-4" />
                              <span>Admin Panel</span>
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-neon-blue text-white rounded-lg btn-glow"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 glass rounded-lg hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-dark mt-4"
            >
              <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        isActivePath(item.path)
                          ? 'bg-neon-blue/20 text-neon-blue'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {isAuthenticated ? (
                    <>
                      <Link
                        to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {user?.role === 'admin' ? 'Payment Requests' : 'Dashboard'}
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-neon-blue text-white rounded-lg text-center"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;
