const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { protect, requirePayment } = require('../middleware/auth');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by sub-category if provided
    if (req.query.subCategory) {
      query.subCategory = req.query.subCategory;
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Only show active events
    query.isActive = true;

    const events = await Event.find(query)
      .sort({ date: 1, time: 1 })
      .select('-coordinator.email');

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get events'
    });
  }
});

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
router.get('/:id([0-9a-fA-F]{24})', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get event'
    });
  }
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private
router.post('/:id([0-9a-fA-F]{24})/register', protect, requirePayment, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if registration is still open
    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: 'Registration is closed for this event'
      });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event'
      });
    }

    // Create registration. Fest fee is paid once at user level, so each
    // event registration is directly marked as paid/confirmed.
    const registration = await Registration.create({
      user: userId,
      event: eventId,
      amount: 0,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentId: req.user.paymentId || null,
      participantDetails: req.body.participantDetails || {}
    });

    // Add event to user's registered events
    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, {
      $addToSet: { registeredEvents: eventId }
    });

    // Populate registration with event and user details
    await registration.populate([
      { path: 'event', select: 'name date time venue' },
      { path: 'user', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Successfully registered for the event',
      registration
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to register for event'
    });
  }
});

// @desc    Get user's event registrations
// @route   GET /api/events/my-registrations
// @access  Private
router.get('/my-registrations', protect, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'name description category subCategory date time venue prizePool status'
      })
      .sort({ registrationDate: -1 });

    const pendingRegistrationIds = registrations
      .filter((registration) => registration.paymentStatus !== 'paid')
      .map((registration) => registration._id);

    if (pendingRegistrationIds.length > 0) {
      const Payment = require('../models/Payment');
      const completedPayments = await Payment.find({
        user: req.user.id,
        registrationId: { $in: pendingRegistrationIds },
        status: 'completed'
      });

      if (completedPayments.length > 0) {
        await Promise.all(completedPayments.map((payment) => (
          Registration.findByIdAndUpdate(payment.registrationId, {
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentId: payment._id.toString()
          })
        )));

        const User = require('../models/User');
        await User.findByIdAndUpdate(req.user.id, {
          $addToSet: { registeredEvents: { $each: completedPayments.map((payment) => payment.eventId) } }
        });

        const refreshedRegistrations = await Registration.find({ user: req.user.id })
          .populate({
            path: 'event',
            select: 'name description category subCategory date time venue prizePool status'
          })
          .sort({ registrationDate: -1 });

        return res.status(200).json({
          success: true,
          count: refreshedRegistrations.length,
          registrations: refreshedRegistrations
        });
      }
    }

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

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/cancel
// @access  Private
router.delete('/:id([0-9a-fA-F]{24})/cancel', protect, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if cancellation is allowed (e.g., before event starts)
    const event = await Event.findById(eventId);
    const eventDateTime = new Date(`${event.date} ${event.time}`);
    const now = new Date();

    if (eventDateTime <= now) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel registration after event has started'
      });
    }

    // Update registration status
    registration.status = 'cancelled';
    await registration.save();

    // Remove event from user's registered events
    const User = require('../models/User');
    await User.findByIdAndUpdate(userId, {
      $pull: { registeredEvents: eventId }
    });

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel registration'
    });
  }
});

// @desc    Get event categories
// @route   GET /api/events/categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Event.distinct('category');
    const subCategories = await Event.distinct('subCategory');

    res.status(200).json({
      success: true,
      categories,
      subCategories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get categories'
    });
  }
});

// @desc    Search events
// @route   GET /api/events/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const events = await Event.find({
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } },
            { subCategory: { $regex: q, $options: 'i' } },
            { venue: { $regex: q, $options: 'i' } }
          ]
        }
      ]
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Search events error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to search events'
    });
  }
});

module.exports = router;
