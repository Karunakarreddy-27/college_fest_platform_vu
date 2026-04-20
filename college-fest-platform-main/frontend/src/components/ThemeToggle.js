import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark, isLight } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`fixed top-4 right-4 z-50 p-3 rounded-full glass border transition-all duration-300 group ${
        theme === 'dark' 
          ? 'border-dark-border/20 hover:border-neon-blue/50' 
          : 'border-light-border/20 hover:border-neon-purple/50'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Sun icon for light theme */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ 
            opacity: theme === 'light' ? 1 : 0,
            rotate: theme === 'light' ? 0 : 180,
            scale: theme === 'light' ? 1 : 0.5
          }}
          transition={{ duration: 0.3 }}
        >
          <Sun className="w-5 h-5 text-yellow-400" />
        </motion.div>

        {/* Moon icon for dark theme */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={false}
          animate={{ 
            opacity: theme === 'dark' ? 1 : 0,
            rotate: theme === 'dark' ? 0 : -180,
            scale: theme === 'dark' ? 1 : 0.5
          }}
          transition={{ duration: 0.3 }}
        >
          <Moon className="w-5 h-5 text-blue-300" />
        </motion.div>
      </div>

      {/* Tooltip */}
      <motion.div
        className="absolute top-full mt-2 right-0 px-2 py-1 bg-dark-bg text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        initial={false}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
