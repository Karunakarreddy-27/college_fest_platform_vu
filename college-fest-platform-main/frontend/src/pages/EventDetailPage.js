import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Trophy, 
  Users, 
  User,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  X
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getLocalGameImage } from '../utils/gameImages';

const FEST_FEE_AMOUNT = 500;

const EventDetailPage = () => {
  const { theme } = useTheme();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    teamName: '',
    teamMembers: [{ name: '', email: '', phone: '' }]
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [checkingRegistrationState, setCheckingRegistrationState] = useState(false);
  
  const { isAuthenticated, user, api } = useAuth();

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${id}`);
      const data = await response.json();
      if (data.success) {
        setEvent(data.event);
      } else {
        setError('Event not found');
      }
    } catch (error) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRegistrationStatus = useCallback(async () => {
    try {
      setCheckingRegistrationState(true);
      const response = await api.get('/events/my-registrations');
      const alreadyRegistered = (response.data?.registrations || []).some(
        (registration) => registration?.event?._id === id
      );
      setIsAlreadyRegistered(alreadyRegistered);
    } catch (registrationError) {
      console.error('Error checking registration status:', registrationError);
    } finally {
      setCheckingRegistrationState(false);
    }
  }, [api, id]);

  useEffect(() => {
    fetchEvent();

    if (isAuthenticated) {
      fetchRegistrationStatus();
    } else {
      setIsAlreadyRegistered(false);
      setCheckingRegistrationState(false);
    }
  }, [fetchEvent, fetchRegistrationStatus, isAuthenticated]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
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

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsRegistering(true);
    setError('');

    try {
      const response = await api.post(`/events/${id}/register`, {
        participantDetails: registrationData
      });

      if (response.data.success) {
        setRegistrationSuccess(true);
        setShowRegistrationModal(false);
        setIsAlreadyRegistered(true);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      if (error.response?.data?.message?.toLowerCase().includes('already registered')) {
        setIsAlreadyRegistered(true);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const addTeamMember = () => {
    setRegistrationData({
      ...registrationData,
      teamMembers: [...registrationData.teamMembers, { name: '', email: '', phone: '' }]
    });
  };

  const removeTeamMember = (index) => {
    const updatedMembers = registrationData.teamMembers.filter((_, i) => i !== index);
    setRegistrationData({
      ...registrationData,
      teamMembers: updatedMembers
    });
  };

  const updateTeamMember = (index, field, value) => {
    const updatedMembers = [...registrationData.teamMembers];
    updatedMembers[index][field] = value;
    setRegistrationData({
      ...registrationData,
      teamMembers: updatedMembers
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Event Not Found</h2>
          <p className="text-gray-400 mb-8">{error}</p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Events</span>
          </Link>
        </motion.div>

        {/* Event Header */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Event Image */}
          <div className="lg:col-span-2">
            <div className="relative h-96 rounded-xl overflow-hidden">
              {(() => {
                const localImage = getLocalGameImage(event.subCategory);
                const defaultImage = '/logo512.svg';
                const preferredImage = localImage || event.posterImage || defaultImage;

                return (
              <img
                src={preferredImage}
                alt={event.name}
                className="w-full h-full object-cover"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Event Title Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm font-semibold">
                    {event.category}
                  </span>
                  <span className="px-3 py-1 bg-neon-purple/20 text-neon-purple rounded-full text-sm font-semibold">
                    {event.subCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Info Card */}
          <div className="space-y-6">
            {/* Quick Info */}
            <motion.div
              className="glass rounded-xl p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-neon-blue" />
                  <div>
                    <div className="text-sm text-gray-400">Date</div>
                    <div>{formatDate(event.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-neon-blue" />
                  <div>
                    <div className="text-sm text-gray-400">Time</div>
                    <div>{formatTime(event.time)}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-neon-blue" />
                  <div>
                    <div className="text-sm text-gray-400">Venue</div>
                    <div>{event.venue}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Trophy className="w-5 h-5 mr-3 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">Prize Pool</div>
                    <div className="text-yellow-400 font-bold">₹{event.prizePool}</div>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-3 text-neon-blue" />
                  <div>
                    <div className="text-sm text-gray-400">Participants</div>
                    <div>{event.currentParticipants}/{event.maxParticipants}</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-dark-border rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-neon-blue to-neon-purple h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {event.maxParticipants - event.currentParticipants} spots remaining
                </p>
              </div>
            </motion.div>

            {/* Registration Status */}
            {event.isRegistrationOpen ? (
              <motion.div
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Registration</h3>
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                </div>
                
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm">Sign up to register for this event</p>
                    <Link
                      to="/signup"
                      className="w-full px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow text-center block"
                    >
                      Sign Up to Register
                    </Link>
                  </div>
                ) : checkingRegistrationState ? (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm">Checking your registration status...</p>
                    <button
                      type="button"
                      disabled
                      className="w-full px-4 py-3 bg-white/10 text-gray-300 rounded-lg"
                    >
                      Please wait
                    </button>
                  </div>
                ) : isAlreadyRegistered ? (
                  <div className="space-y-3">
                    <p className="text-green-400 text-sm font-semibold">You are already registered for this event.</p>
                    <Link
                      to="/dashboard"
                      className="w-full px-4 py-3 bg-green-500/20 text-green-400 rounded-lg text-center block hover:bg-green-500/30 transition-colors"
                    >
                      View in Dashboard
                    </Link>
                  </div>
                ) : user?.paymentStatus !== 'paid' ? (
                  <div className="space-y-3">
                    <p className="text-gray-400 text-sm">
                      Complete one-time fest payment in dashboard to unlock registrations.
                    </p>
                    <Link
                      to="/dashboard"
                      className="w-full px-4 py-3 glass rounded-lg text-center block hover:bg-white/10 transition-colors"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowRegistrationModal(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow"
                  >
                    Register Now
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                className="glass rounded-xl p-6"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center space-x-2 text-red-400 mb-4">
                  <X className="w-5 h-5" />
                  <span className="text-xl font-bold">Registration Closed</span>
                </div>
                <p className="text-gray-400 text-sm">
                  {event.currentParticipants >= event.maxParticipants 
                    ? 'All spots have been filled' 
                    : 'Registration period has ended'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Event Description */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">About the Event</h3>
              <p className="text-gray-300 leading-relaxed">{event.description}</p>
            </div>

            {/* Rules */}
            {event.rules && event.rules.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Rules & Regulations</h3>
                <ul className="space-y-2">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-neon-blue mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {event.requirements && event.requirements.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Coordinator Info */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Event Coordinator</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neon-blue/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-neon-blue" />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{event.coordinator.name}</div>
                    <div className="text-gray-400 text-sm">Event Coordinator</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-4 h-4 text-neon-blue" />
                  <span>{event.coordinator.phone}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-4 h-4 text-neon-blue" />
                  <span>{event.coordinator.email}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Fest Fee</h3>
              <div className="text-2xl font-bold text-neon-blue">Rs. {FEST_FEE_AMOUNT}</div>
              <p className="text-gray-400 text-sm mt-2">One-time payment for all events</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Registration Modal */}
      {showRegistrationModal && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Event Registration</h2>
              <button
                onClick={() => setShowRegistrationModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleRegistration} className="space-y-6">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name (Optional)
                </label>
                <input
                  type="text"
                  value={registrationData.teamName}
                  onChange={(e) => setRegistrationData({...registrationData, teamName: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                  placeholder="Enter team name"
                />
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Members
                </label>
                {registrationData.teamMembers.map((member, index) => (
                  <div key={index} className="space-y-3 p-4 glass rounded-lg mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Member {index + 1}</span>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                        placeholder="Name"
                        required={index === 0}
                      />
                      <input
                        type="email"
                        value={member.email}
                        onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                        className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                        placeholder="Email"
                        required={index === 0}
                      />
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => updateTeamMember(index, 'phone', e.target.value)}
                        className="px-3 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                        placeholder="Phone"
                        required={index === 0}
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="w-full py-2 glass rounded-lg hover:bg-white/10 transition-colors text-neon-blue"
                >
                  + Add Team Member
                </button>
              </div>

              {/* Submit */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRegistrationModal(false)}
                  className="flex-1 px-4 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow disabled:opacity-50"
                >
                  {isRegistering ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Success Modal */}
      {registrationSuccess && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="glass rounded-2xl p-8 max-w-md w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-gray-400 mb-6">
              You have successfully registered for {event.name}. Check your dashboard for details.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow"
            >
              Go to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EventDetailPage;
