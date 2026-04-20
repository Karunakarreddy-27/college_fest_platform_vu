import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  Trophy, 
  Clock,
  QrCode,
  Download,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Settings,
  LogOut,
  ArrowRight,
  Ticket,
  MapPin
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardPage = () => {
  const { theme } = useTheme();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  const { user, logout, api } = useAuth();
  const navigate = useNavigate();

  const fetchRegistrations = useCallback(async () => {
    try {
      const response = await api.get('/events/my-registrations');
      setRegistrations(response.data.registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchQRCode = useCallback(async () => {
    try {
      const response = await api.get('/users/qrcode');
      setQrCodeData(response.data.qrCode);
    } catch (error) {
      console.error('Error fetching QR code:', error);
    }
  }, [api]);

  useEffect(() => {
    fetchRegistrations();
    fetchQRCode();
    const refreshInterval = setInterval(fetchRegistrations, 10000);

    return () => clearInterval(refreshInterval);
  }, [fetchRegistrations, fetchQRCode]);

  const handleLogout = () => {
    logout();
    navigate('/');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-400';
      case 'registered': return 'text-yellow-400';
      case 'cancelled': return 'text-red-400';
      case 'completed': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'registered': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <Trophy className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const downloadTicket = (registration) => {
    // Create a simple ticket download (in real app, this would generate PDF)
    const ticketData = {
      name: user.name,
      email: user.email,
      eventName: registration.event.name,
      eventDate: registration.event.date,
      eventTime: registration.event.time,
      venue: registration.event.venue,
      registrationId: registration._id,
      qrCode: qrCodeData
    };
    
    const dataStr = JSON.stringify(ticketData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${registration.event.name.replace(/\s+/g, '_')}_ticket.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-400">
            {registrations.length > 0
              ? `You have registered for ${registrations.length} event${registrations.length > 1 ? 's' : ''} (${registrations.filter((registration) => registration.status === 'confirmed').length} confirmed).`
              : 'Manage your profile and event registrations'}
          </p>
        </motion.div>

        {/* Dashboard Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-neon-blue/20 rounded-full flex items-center justify-center">
                <Ticket className="w-6 h-6 text-neon-blue" />
              </div>
              <span className="text-2xl font-bold text-white">{registrations.length}</span>
            </div>
            <p className="text-gray-400">Total Registrations</p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {registrations.filter(r => r.status === 'confirmed').length}
              </span>
            </div>
            <p className="text-gray-400">Confirmed Events</p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {registrations.filter(r => r.status === 'registered').length}
              </span>
            </div>
            <p className="text-gray-400">Pending Events</p>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {registrations.filter(r => r.status === 'completed').length}
              </span>
            </div>
            <p className="text-gray-400">Completed Events</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex space-x-1 mb-8 p-1 glass rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {['overview', 'registrations', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                  <div className="glass rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{user?.name}</h3>
                        <p className="text-gray-400">{user?.college}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-gray-300">
                        <Mail className="w-4 h-4 text-neon-blue" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <Phone className="w-4 h-4 text-neon-blue" />
                        <span className="text-sm">{user?.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-300">
                        <Building className="w-4 h-4 text-neon-blue" />
                        <span className="text-sm">{user?.college}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-dark-border">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-400">Payment Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user?.paymentStatus === 'paid' 
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {user?.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>

                      {user?.paymentStatus !== 'paid' && (
                        <div className="space-y-3">
                          <p className="text-xs text-gray-400">One-time fest fee required to unlock all event registrations.</p>
                          <Link
                            to="/payment"
                            className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-center block"
                          >
                            Complete Payment
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* QR Code Button */}
                    {user?.paymentStatus === 'paid' && qrCodeData && (
                      <button
                        onClick={() => setShowQRCode(true)}
                        className="w-full mt-4 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center space-x-2"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Show QR Code</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Recent Registrations */}
                <div className="lg:col-span-2">
                  <div className="glass rounded-xl p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Registrations</h3>
                    
                    {registrations.length === 0 ? (
                      <div className="text-center py-12">
                        <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No event registrations yet</p>
                        <Link
                          to="/events"
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow"
                        >
                          <span>Browse Events</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {registrations.slice(0, 3).map((registration) => (
                          <div key={registration._id} className="glass rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="text-white font-semibold mb-1">{registration.event.name}</h4>
                                <div className="flex items-center space-x-4 text-sm text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(registration.event.date)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTime(registration.event.time)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{registration.event.venue}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`flex items-center space-x-1 ${getStatusColor(registration.status)}`}>
                                  {getStatusIcon(registration.status)}
                                  <span className="text-sm capitalize">{registration.status}</span>
                                </span>
                                <button
                                  onClick={() => downloadTicket(registration)}
                                  className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                                >
                                  <Download className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {registrations.length > 3 && (
                          <Link
                            to="/dashboard"
                            onClick={() => setActiveTab('registrations')}
                            className="text-neon-blue hover:text-neon-purple transition-colors text-sm"
                          >
                            View all registrations →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-6">All Event Registrations</h3>
                
                {registrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No event registrations yet</p>
                    <Link
                      to="/events"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow"
                    >
                      <span>Browse Events</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {registrations.map((registration) => (
                      <div key={registration._id} className="glass rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h4 className="text-lg font-semibold text-white">{registration.event.name}</h4>
                              <span className={`flex items-center space-x-1 ${getStatusColor(registration.status)}`}>
                                {getStatusIcon(registration.status)}
                                <span className="text-sm capitalize">{registration.status}</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-neon-blue" />
                                <span>{formatDate(registration.event.date)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-neon-blue" />
                                <span>{formatTime(registration.event.time)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-neon-blue" />
                                <span>{registration.event.venue}</span>
                              </div>
                            </div>

                            <div className="mt-4 flex items-center space-x-4">
                              <span className="text-sm text-gray-400">
                                Category: {registration.event.category}
                              </span>
                              <span className="text-sm text-gray-400">
                                Prize Pool: ₹{registration.event.prizePool}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Link
                              to={`/events/${registration.event._id}`}
                              className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </Link>
                            <button
                              onClick={() => downloadTicket(registration)}
                              className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                            >
                              <Download className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                      <div className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white">
                        {user?.name}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                      <div className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white">
                        {user?.email}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                      <div className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white">
                        {user?.phone}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">College Name</label>
                      <div className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white">
                        {user?.college}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="glass rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <button className="w-full px-4 py-3 glass rounded-lg hover:bg-white/10 transition-colors text-left flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-gray-400" />
                      <span>Edit Profile</span>
                    </button>
                    
                    <button className="w-full px-4 py-3 glass rounded-lg hover:bg-white/10 transition-colors text-left flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                      <span>Payment History</span>
                    </button>
                    
                    <button className="w-full px-4 py-3 glass rounded-lg hover:bg-white/10 transition-colors text-left flex items-center space-x-3">
                      <Download className="w-5 h-5 text-gray-400" />
                      <span>Download Data</span>
                    </button>
                    
                    <button
                      onClick={logout}
                      className="w-full px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-left flex items-center space-x-3"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* QR Code Modal */}
      {showQRCode && qrCodeData && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass rounded-2xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6">Your Fest Pass</h3>
              
              <div className="w-64 h-64 mx-auto mb-6 bg-white p-4 rounded-lg">
                <img src={qrCodeData} alt="QR Code" className="w-full h-full" />
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-white font-semibold">{user?.name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <p className="text-gray-400 text-sm">{user?.college}</p>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow">
                  Download
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage;
