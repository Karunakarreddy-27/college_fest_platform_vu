import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Search, Heart, Share2, Download, Maximize2 } from 'lucide-react';

const GalleryPage = () => {
  const { } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Gallery data uses local action images from /public/game-images
  const galleryImages = [
    {
      id: 1,
      title: 'National 100m Final',
      category: 'events',
      image: '/game-images/race-100m.jpg',
      likes: 245,
      description: 'Athletes sprinting in a high-intensity 100m race'
    },
    {
      id: 2,
      title: 'Inter-College Cricket',
      category: 'sports',
      image: '/game-images/cricket.jpg',
      likes: 189,
      description: 'Competitive cricket action between college teams'
    },
    {
      id: 3,
      title: 'Kabaddi Raid Moment',
      category: 'sports',
      image: '/game-images/kabaddi.jpg',
      likes: 312,
      description: 'National-level kabaddi action during a live raid'
    },
    {
      id: 4,
      title: 'Chess Tournament Clash',
      category: 'sports',
      image: '/game-images/chess.jpg',
      likes: 428,
      description: 'Indian grandmaster in tournament gameplay'
    },
    {
      id: 5,
      title: '400m Championship',
      category: 'sports',
      image: '/game-images/race-400m.jpg',
      likes: 367,
      description: '400m track race with national-level pace and form'
    },
    {
      id: 6,
      title: 'Volleyball Court Action',
      category: 'sports',
      image: '/game-images/volleyball.jpg',
      likes: 298,
      description: 'Live volleyball rally from a competitive match'
    },
    {
      id: 7,
      title: 'Football League Match',
      category: 'sports',
      image: '/game-images/football.jpg',
      likes: 176,
      description: 'Fast break play during an inter-college football game'
    },
    {
      id: 8,
      title: 'Table Tennis Rally',
      category: 'sports',
      image: '/game-images/table-tennis.jpg',
      likes: 512,
      description: 'Quick reflex exchanges in a table tennis face-off'
    },
    {
      id: 9,
      title: 'Badminton Finals',
      category: 'sports',
      image: '/game-images/badminton.jpg',
      likes: 234,
      description: 'High-tempo badminton finals under tournament lights'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Photos', count: galleryImages.length },
    { id: 'ceremony', name: 'Ceremony', count: galleryImages.filter(img => img.category === 'ceremony').length },
    { id: 'events', name: 'Events', count: galleryImages.filter(img => img.category === 'events').length },
    { id: 'workshop', name: 'Workshops', count: galleryImages.filter(img => img.category === 'workshop').length },
    { id: 'cultural', name: 'Cultural', count: galleryImages.filter(img => img.category === 'cultural').length },
    { id: 'sports', name: 'Sports', count: galleryImages.filter(img => img.category === 'sports').length }
  ];

  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Gallery</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Relive the amazing moments from TechFest 2026
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
              />
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto pb-2 lg:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                      : 'glass text-gray-400 hover:text-white'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              className="glass rounded-xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Like functionality
                      }}
                      className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Heart className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Share functionality
                      }}
                      className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Download functionality
                      }}
                      className="w-10 h-10 glass rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Download className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs font-semibold capitalize">
                    {image.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{image.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{image.description}</p>
                <div className="flex items-center space-x-2 text-gray-400 text-sm">
                  <Heart className="w-4 h-4" />
                  <span>{image.likes} likes</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredImages.length === 0 && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-2xl font-bold text-white mb-2">No photos found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            className="relative max-w-4xl w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            
            {/* Modal Header */}
            <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{selectedImage.title}</h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-gray-300 mb-4">{selectedImage.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-white hover:text-neon-blue transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>{selectedImage.likes}</span>
                  </button>
                  <button className="flex items-center space-x-2 text-white hover:text-neon-blue transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                  <button className="flex items-center space-x-2 text-white hover:text-neon-blue transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                </div>
                <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm font-semibold capitalize">
                  {selectedImage.category}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default GalleryPage;
