import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Download,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Trophy,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const paymentApprovalOnly = true;
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    category: 'Sports',
    subCategory: 'Cricket',
    date: '',
    time: '',
    venue: '',
    prizePool: 0,
    maxParticipants: 50,
    registrationFee: 0,
    rules: [],
    requirements: [],
    coordinator: {
      name: '',
      phone: '',
      email: ''
    }
  });
  
  const { api } = useAuth();

  useEffect(() => {
    if (paymentApprovalOnly) {
      fetchPayments();
      return;
    }

    fetchAnalytics();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'events') fetchEvents();
    if (activeTab === 'registrations') fetchRegistrations();
    if (activeTab === 'payments') fetchPayments();
  }, [activeTab, paymentApprovalOnly]);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await api.get('/admin/registrations');
      setRegistrations(response.data.registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/admin/payments?status=all');
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, eventForm);
      } else {
        await api.post('/admin/events', eventForm);
      }
      
      setShowEventModal(false);
      setEditingEvent(null);
      setEventForm({
        name: '',
        description: '',
        category: 'Sports',
        subCategory: 'Cricket',
        date: '',
        time: '',
        venue: '',
        prizePool: 0,
        maxParticipants: 50,
        registrationFee: 0,
        rules: [],
        requirements: [],
        coordinator: {
          name: '',
          phone: '',
          email: ''
        }
      });
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/admin/events/${eventId}`);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleUpdatePaymentStatus = async (userId, status) => {
    try {
      await api.put(`/admin/users/${userId}/payment`, { paymentStatus: status });
      fetchUsers();
      fetchAnalytics();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleManualPaymentStatus = async (paymentId, status) => {
    try {
      await api.put(`/admin/payments/${paymentId}/status`, { status });
      fetchPayments();
    } catch (error) {
      console.error('Error updating manual payment:', error);
    }
  };

  const exportData = async (type) => {
    try {
      const response = await api.get(`/admin/export/${type}`);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_export.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.college.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.paymentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading && activeTab !== 'overview') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
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
          <h1 className="text-4xl font-bold gradient-text mb-2">
            {paymentApprovalOnly ? 'Payment Approval Panel' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-400">
            {paymentApprovalOnly ? 'Approve or reject submitted payment requests.' : 'Manage the college fest platform'}
          </p>
        </motion.div>

        {/* Tabs */}
        {!paymentApprovalOnly && (
          <motion.div
            className="flex space-x-1 mb-8 p-1 glass rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {['overview', 'users', 'events', 'registrations', 'payments'].map((tab) => (
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
        )}

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {!paymentApprovalOnly && activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {analytics ? (
                <div className="space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                      className="glass rounded-xl p-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="flex items-center text-green-400">
                          <ArrowUp className="w-4 h-4" />
                          <span className="text-sm">12%</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{analytics.users.total}</h3>
                      <p className="text-gray-400">Total Users</p>
                    </motion.div>

                    <motion.div
                      className="glass rounded-xl p-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                        <div className="flex items-center text-green-400">
                          <ArrowUp className="w-4 h-4" />
                          <span className="text-sm">8%</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{analytics.users.paid}</h3>
                      <p className="text-gray-400">Paid Users</p>
                    </motion.div>

                    <motion.div
                      className="glass rounded-xl p-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-purple-400" />
                        </div>
                        <div className="flex items-center text-red-400">
                          <ArrowDown className="w-4 h-4" />
                          <span className="text-sm">3%</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{analytics.events.total}</h3>
                      <p className="text-gray-400">Total Events</p>
                    </motion.div>

                    <motion.div
                      className="glass rounded-xl p-6"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex items-center text-green-400">
                          <ArrowUp className="w-4 h-4" />
                          <span className="text-sm">15%</span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">₹{analytics.revenue.total.toLocaleString()}</h3>
                      <p className="text-gray-400">Total Revenue</p>
                    </motion.div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Daily Registrations */}
                    <motion.div
                      className="glass rounded-xl p-6"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <h3 className="text-xl font-bold text-white mb-6">Daily Registrations</h3>
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {analytics.dailyRegistrations.map((day, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div
                              className="w-full bg-gradient-to-t from-neon-blue to-neon-purple rounded-t"
                              style={{ height: `${(day.count / Math.max(...analytics.dailyRegistrations.map(d => d.count))) * 100}%` }}
                            />
                            <span className="text-xs text-gray-400 mt-2">{day._id.split('-')[2]}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Category Distribution */}
                    <motion.div
                      className="glass rounded-xl p-6"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="text-xl font-bold text-white mb-6">Event Categories</h3>
                      <div className="space-y-4">
                        {analytics.categoryDistribution.map((category, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-300">{category._id}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-dark-border rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-neon-blue to-neon-purple h-2 rounded-full"
                                  style={{ width: `${(category.count / analytics.events.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-400">{category.count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>

                  {/* Popular Events */}
                  <motion.div
                    className="glass rounded-xl p-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-6">Popular Events</h3>
                    <div className="space-y-4">
                      {analytics.popularEvents.map((event, index) => (
                        <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-8 h-8 bg-neon-blue/20 rounded-full flex items-center justify-center">
                              <Trophy className="w-4 h-4 text-neon-blue" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{event.eventName}</h4>
                              <p className="text-gray-400 text-sm">{event.count} registrations</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold gradient-text">{event.count}</div>
                            <div className="text-xs text-gray-400">participants</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <LoadingSpinner size="lg" text="Loading analytics..." />
              )}
            </motion.div>
          )}

          {/* Users Tab */}
          {!paymentApprovalOnly && activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-xl p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 lg:mb-0">User Management</h3>
                  
                  <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    >
                      <option value="all">All Users</option>
                      <option value="paid">Paid Users</option>
                      <option value="pending">Pending Payment</option>
                    </select>
                    
                    <button
                      onClick={() => exportData('registrations')}
                      className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="text-left py-3 px-4 text-gray-400">User</th>
                        <th className="text-left py-3 px-4 text-gray-400">Contact</th>
                        <th className="text-left py-3 px-4 text-gray-400">College</th>
                        <th className="text-left py-3 px-4 text-gray-400">Payment</th>
                        <th className="text-left py-3 px-4 text-gray-400">Events</th>
                        <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="border-b border-dark-border hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-white font-semibold">{user.name}</div>
                              <div className="text-gray-400 text-sm">{user.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-300">{user.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-300">{user.college}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              user.paymentStatus === 'paid' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {user.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-300">{user.registeredEvents?.length || 0}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              {user.paymentStatus === 'pending' && (
                                <button
                                  onClick={() => handleUpdatePaymentStatus(user._id, 'paid')}
                                  className="p-1 glass rounded hover:bg-green-500/20 transition-colors"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </button>
                              )}
                              <button className="p-1 glass rounded hover:bg-white/10 transition-colors">
                                <Eye className="w-4 h-4 text-gray-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Events Tab */}
          {!paymentApprovalOnly && activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Event Management</h3>
                  <button
                    onClick={() => setShowEventModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Event</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div key={event._id} className="glass rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-1">{event.name}</h4>
                          <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-xs">
                            {event.category}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setEventForm(event);
                              setShowEventModal(true);
                            }}
                            className="p-1 glass rounded hover:bg-white/10 transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event._id)}
                            className="p-1 glass rounded hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{event.currentParticipants}/{event.maxParticipants}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-yellow-400" />
                          <span>₹{event.prizePool}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Registrations Tab */}
          {!paymentApprovalOnly && activeTab === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Event Registrations</h3>
                  <button
                    onClick={() => exportData('registrations')}
                    className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="text-left py-3 px-4 text-gray-400">Event</th>
                        <th className="text-left py-3 px-4 text-gray-400">Participant</th>
                        <th className="text-left py-3 px-4 text-gray-400">Contact</th>
                        <th className="text-left py-3 px-4 text-gray-400">Date</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map((registration) => (
                        <tr key={registration._id} className="border-b border-dark-border hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-white font-semibold">{registration.event.name}</div>
                              <div className="text-gray-400 text-sm">{registration.event.category}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-white">{registration.user.name}</div>
                              <div className="text-gray-400 text-sm">{registration.user.college}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-300">{registration.user.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-300">
                              {new Date(registration.registrationDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              registration.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                              registration.status === 'registered' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {registration.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              registration.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {registration.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Manual Payment Verification</h3>
                  <button
                    onClick={fetchPayments}
                    className="px-4 py-2 glass rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-border">
                        <th className="text-left py-3 px-4 text-gray-400">User</th>
                        <th className="text-left py-3 px-4 text-gray-400">Payment Type</th>
                        <th className="text-left py-3 px-4 text-gray-400">UTR</th>
                        <th className="text-left py-3 px-4 text-gray-400">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-400">Screenshot</th>
                        <th className="text-left py-3 px-4 text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment._id} className="border-b border-dark-border hover:bg-white/5">
                          <td className="py-3 px-4">
                            <div>
                              <div className="text-white font-semibold">{payment.user?.name}</div>
                              <div className="text-gray-400 text-sm">{payment.user?.email}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-gray-300">
                              {payment.type === 'fest_fee'
                                ? 'Fest Fee (One-Time)'
                                : payment.eventId?.name || 'Event Registration'}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-neon-blue font-mono text-sm">{payment.gatewayTransactionId}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-green-400 font-semibold">Rs. {payment.amount}</div>
                          </td>
                          <td className="py-3 px-4">
                            {payment.metadata?.screenshotDataUrl ? (
                              <a
                                href={payment.metadata.screenshotDataUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-neon-blue hover:text-neon-purple transition-colors"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              payment.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              payment.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {payment.status === 'pending' ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleManualPaymentStatus(payment._id, 'completed')}
                                  className="p-2 glass rounded hover:bg-green-500/20 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </button>
                                <button
                                  onClick={() => handleManualPaymentStatus(payment._id, 'failed')}
                                  className="p-2 glass rounded hover:bg-red-500/20 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-500 text-sm">Done</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Event Modal */}
      {showEventModal && (
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
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>

            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Event Name</label>
                  <input
                    type="text"
                    value={eventForm.name}
                    onChange={(e) => setEventForm({...eventForm, name: e.target.value})}
                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                  >
                    <option value="Sports">Sports</option>
                    <option value="Games">Games</option>
                    <option value="Athletics">Athletics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Venue</label>
                  <input
                    type="text"
                    value={eventForm.venue}
                    onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Prize Pool</label>
                  <input
                    type="number"
                    value={eventForm.prizePool}
                    onChange={(e) => setEventForm({...eventForm, prizePool: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Participants</label>
                  <input
                    type="number"
                    value={eventForm.maxParticipants}
                    onChange={(e) => setEventForm({...eventForm, maxParticipants: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                  }}
                  className="flex-1 px-4 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-lg btn-glow"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminDashboard;
