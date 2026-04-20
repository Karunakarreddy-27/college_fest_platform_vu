import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Trophy, 
  Users, 
  Clock,
  ChevronRight,
  X,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getLocalGameImage } from '../utils/gameImages';

const FEST_FEE_AMOUNT = 500;

const EventsPage = () => {
  const { theme } = useTheme();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  
  const { isAuthenticated, user, api } = useAuth();

  const filterEvents = useCallback(() => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.subCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Sub-category filter
    if (selectedSubCategory !== 'All') {
      filtered = filtered.filter(event => event.subCategory === selectedSubCategory);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setRegisteredEventIds(new Set());
      return;
    }

    const fetchUserRegistrations = async () => {
      try {
        const response = await api.get('/events/my-registrations');
        const registeredIds = new Set(
          (response.data?.registrations || []).map((registration) => registration?.event?._id).filter(Boolean)
        );
        setRegisteredEventIds(registeredIds);
      } catch (registrationError) {
        console.error('Error fetching user registrations:', registrationError);
      }
    };

    fetchUserRegistrations();
  }, [api, isAuthenticated]);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const fetchEvents = async () => {
    try {
      setFetchError('');
      const response = await fetch('http://localhost:5000/api/events');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to fetch events (HTTP ${response.status})`);
      }

      const data = await response.json();
      if (data.success) {
        setEvents(data.events);
        setFilteredEvents(data.events);
      } else {
        throw new Error(data.message || 'Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
      setFilteredEvents([]);
      setFetchError(error.message || 'Unable to load events right now.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/events/categories/list');
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
        setSubCategories(data.subCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Sports': return 'from-blue-500 to-cyan-500';
      case 'Games': return 'from-purple-500 to-pink-500';
      case 'Athletics': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Sports': return '⚽';
      case 'Games': return '🎮';
      case 'Athletics': return '🏃';
      default: return '📅';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading amazing events..." />
      </div>
    );
  }

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
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Explore Events
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover exciting competitions and showcase your talents
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
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-300"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                className="mt-4 p-6 glass rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    >
                      <option value="All">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sub-Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sub-Category
                    </label>
                    <select
                      value={selectedSubCategory}
                      onChange={(e) => setSelectedSubCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    >
                      <option value="All">All Sub-Categories</option>
                      {subCategories.map(subCategory => (
                        <option key={subCategory} value={subCategory}>{subCategory}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-400">
            {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
          </p>
          
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="text-neon-blue hover:text-neon-purple transition-colors flex items-center space-x-1"
            >
              <span>Sign up to participate</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>

        {fetchError && (
          <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
            {fetchError}
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event._id}
                className="glass rounded-xl overflow-hidden card-hover group"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                layout
              >
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  {(() => {
                    const localImage = getLocalGameImage(event.subCategory);
                    const defaultImage = '/logo512.svg';
                    const preferredImage = localImage || event.posterImage || defaultImage;

                    return (
                  <img
                    src={preferredImage}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      if (e.currentTarget.dataset.fallbackApplied === 'true') {
                        e.currentTarget.src = defaultImage;
                        return;
                      }

                      e.currentTarget.dataset.fallbackApplied = 'true';

                      if (event.posterImage) {
                        e.currentTarget.src = event.posterImage;
                      } else {
                        e.currentTarget.src = defaultImage;
                      }
                    }}
                  />
                    );
                  })()}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(event.category)} rounded-full text-white text-sm font-semibold flex items-center space-x-1`}>
                      <span>{getCategoryIcon(event.category)}</span>
                      <span>{event.category}</span>
                    </div>
                  </div>

                  {/* Prize Pool Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1 glass rounded-full text-yellow-400 text-sm font-semibold flex items-center space-x-1">
                      <Trophy className="w-4 h-4" />
                      <span>₹{event.prizePool}</span>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                    {event.name}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-neon-blue" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-neon-blue" />
                      <span>{formatTime(event.time)}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-neon-blue" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Users className="w-4 h-4 mr-2 text-neon-blue" />
                      <span>{event.currentParticipants}/{event.maxParticipants} registered</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-dark-border rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {event.maxParticipants - event.currentParticipants} spots left
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-gray-400">Fest Fee (one-time)</span>
                    <span className="text-green-400 font-semibold">Rs. {FEST_FEE_AMOUNT}</span>
                  </div>

                  <div className="flex space-x-3">
                    <Link
                      to={`/events/${event._id}`}
                      className="flex-1 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300 text-center flex items-center justify-center space-x-1"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    
                    {isAuthenticated && (
                      registeredEventIds.has(event._id) ? (
                        <span className="flex-1 px-4 py-2 rounded-lg text-center bg-green-500/20 text-green-400 font-semibold">
                          Registered
                        </span>
                      ) : user?.paymentStatus === 'paid' ? (
                        <Link
                          to={`/events/${event._id}`}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow text-center"
                        >
                          Register
                        </Link>
                      ) : (
                        <span className="flex-1 px-4 py-2 rounded-lg text-center bg-yellow-500/20 text-yellow-300 text-sm">
                          Payment required in dashboard
                        </span>
                      )
                    )}
                  </div>

                  {!isAuthenticated && (
                    <Link
                      to="/signup"
                      className="w-full px-4 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-300 text-center"
                    >
                      Sign up to register
                    </Link>
                  )}

                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Events Found */}
        {filteredEvents.length === 0 && !loading && (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedSubCategory('All');
              }}
              className="px-6 py-3 glass rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
