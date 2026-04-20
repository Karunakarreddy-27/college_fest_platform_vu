const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Payment = require('../models/Payment');
const { protect, authorize } = require('../middleware/auth');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by payment status
    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    const users = await User.find(query)
      .select('-password')
      .populate('registeredEvents', 'name date')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get users'
    });
  }
});

// @desc    Get dashboard analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    // User statistics
    const totalUsers = await User.countDocuments();
    const paidUsers = await User.countDocuments({ paymentStatus: 'paid' });
    const unpaidUsers = totalUsers - paidUsers;

    // Event statistics
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true, status: 'upcoming' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });

    // Registration statistics
    const totalRegistrations = await Registration.countDocuments();
    const confirmedRegistrations = await Registration.countDocuments({ status: 'confirmed' });
    const cancelledRegistrations = await Registration.countDocuments({ status: 'cancelled' });

    // Payment statistics
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const festFeeRevenue = await Payment.aggregate([
      { $match: { type: 'fest_fee', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const eventRevenue = await Payment.aggregate([
      { $match: { type: 'event_registration', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Event popularity (top 5 events by registrations)
    const popularEvents = await Registration.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: '$event', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'event' } },
      { $unwind: '$event' },
      { $project: { eventName: '$event.name', count: 1 } }
    ]);

    // Daily registrations (last 7 days)
    const dailyRegistrations = await Registration.aggregate([
      {
        $match: {
          registrationDate: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$registrationDate' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Category-wise event distribution
    const categoryDistribution = await Event.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          paid: paidUsers,
          unpaid: unpaidUsers,
          paidPercentage: totalUsers > 0 ? ((paidUsers / totalUsers) * 100).toFixed(1) : 0
        },
        events: {
          total: totalEvents,
          active: activeEvents,
          completed: completedEvents
        },
        registrations: {
          total: totalRegistrations,
          confirmed: confirmedRegistrations,
          cancelled: cancelledRegistrations
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          festFee: festFeeRevenue[0]?.total || 0,
          event: eventRevenue[0]?.total || 0
        },
        popularEvents,
        dailyRegistrations,
        categoryDistribution
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get analytics'
    });
  }
});

// @desc    Create event
// @route   POST /api/admin/events
// @access  Private (Admin only)
router.post('/events', protect, authorize('admin'), async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create event'
    });
  }
});

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private (Admin only)
router.put('/events/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update event'
    });
  }
});

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin only)
router.delete('/events/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if there are registrations for this event
    const registrationCount = await Registration.countDocuments({ event: req.params.id });
    if (registrationCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with existing registrations'
      });
    }

    await event.remove();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete event'
    });
  }
});

// @desc    Get event participants
// @route   GET /api/admin/events/:id/participants
// @access  Private (Admin only)
router.get('/events/:id/participants', protect, authorize('admin'), async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.id })
      .populate('user', 'name email phone college')
      .sort({ registrationDate: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get participants'
    });
  }
});

// @desc    Get all registrations
// @route   GET /api/admin/registrations
// @access  Private (Admin only)
router.get('/registrations', protect, authorize('admin'), async (req, res) => {
  try {
    const registrations = await Registration.find({})
      .populate('user', 'name email phone college')
      .populate('event', 'name category subCategory date time venue')
      .sort({ registrationDate: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get registrations'
    });
  }
});

// @desc    Get manual payment submissions
// @route   GET /api/admin/payments
// @access  Private (Admin only)
router.get('/payments', protect, authorize('admin'), async (req, res) => {
  try {
    const query = {
      type: { $in: ['fest_fee', 'event_registration'] },
      'metadata.provider': 'manual_qr'
    };

    if (req.query.status && req.query.status !== 'all') {
      query.status = req.query.status;
    }

    if (req.query.type && ['fest_fee', 'event_registration'].includes(req.query.type)) {
      query.type = req.query.type;
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email phone college')
      .populate('eventId', 'name category subCategory date time venue')
      .populate('registrationId', 'status paymentStatus')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get manual payments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get manual payments'
    });
  }
});

// @desc    Approve or reject a manual payment
// @route   PUT /api/admin/payments/:id/status
// @access  Private (Admin only)
router.put('/payments/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, failureReason = '' } = req.body;

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Payment status must be completed or failed'
      });
    }

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    payment.status = status;
    payment.failureReason = status === 'failed' ? failureReason || 'Rejected by admin' : null;
    payment.processedAt = new Date();
    payment.metadata = {
      ...payment.metadata,
      verifiedBy: req.user.id,
      verifiedAt: new Date()
    };
    await payment.save();

    if (status === 'completed') {
      if (payment.type === 'fest_fee') {
        await User.findByIdAndUpdate(payment.user, {
          paymentStatus: 'paid',
          paymentId: payment._id.toString(),
          paymentAmount: payment.amount
        });
      } else if (payment.registrationId) {
        const registration = await Registration.findByIdAndUpdate(
          payment.registrationId,
          {
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentId: payment._id.toString()
          },
          { new: true }
        );

        if (registration) {
          await User.findByIdAndUpdate(payment.user, {
            $addToSet: { registeredEvents: registration.event }
          });
        }
      }
    }

    if (status === 'failed') {
      if (payment.type === 'fest_fee') {
        await User.findOneAndUpdate(
          { _id: payment.user, paymentStatus: { $ne: 'paid' } },
          { paymentStatus: 'failed' }
        );
      } else if (payment.registrationId) {
        await Registration.findByIdAndUpdate(payment.registrationId, {
          status: 'registered',
          paymentStatus: 'pending'
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Payment ${status}`,
      payment
    });
  } catch (error) {
    console.error('Update manual payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update payment status'
    });
  }
});

// @desc    Export registrations data
// @route   GET /api/admin/export/registrations
// @access  Private (Admin only)
router.get('/export/registrations', protect, authorize('admin'), async (req, res) => {
  try {
    const registrations = await Registration.find({})
      .populate('user', 'name email phone college')
      .populate('event', 'name category subCategory date time venue')
      .sort({ registrationDate: -1 });

    // Convert to CSV format
    const csvHeader = 'User Name,Email,Phone,College,Event Name,Category,Sub Category,Date,Time,Venue,Registration Date,Status,Payment Status\n';
    const csvData = registrations.map(reg => 
      `"${reg.user.name}","${reg.user.email}","${reg.user.phone}","${reg.user.college}","${reg.event.name}","${reg.event.category}","${reg.event.subCategory}","${reg.event.date}","${reg.event.time}","${reg.event.venue}","${reg.registrationDate}","${reg.status}","${reg.paymentStatus}"`
    ).join('\n');

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Export registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to export registrations'
    });
  }
});

// @desc    Update user payment status
// @route   PUT /api/admin/users/:id/payment
// @access  Private (Admin only)
router.put('/users/:id/payment', protect, authorize('admin'), async (req, res) => {
  try {
    const { paymentStatus, paymentAmount } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { paymentStatus, paymentAmount },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User payment status updated successfully',
      user
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update payment status'
    });
  }
});

module.exports = router;
