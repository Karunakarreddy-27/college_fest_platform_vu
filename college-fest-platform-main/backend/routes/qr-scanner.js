const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// @desc    Get scan history
// @route   GET /api/qr-scanner/history
// @access  Private (Admin only)
router.get('/history', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin access required.'
      });
    }

    // In a real app, this would fetch from database
    // For demo, we'll return mock data
    const mockHistory = [
      {
        id: 1,
        userData: {
          userId: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          paymentId: 'pay_123456',
          paymentStatus: 'paid',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        status: 'approved',
        approvedAt: new Date().toISOString()
      },
      {
        id: 2,
        userData: {
          userId: 'user456',
          name: 'Jane Smith',
          email: 'jane@example.com',
          paymentId: 'pay_789012',
          paymentStatus: 'paid',
          timestamp: new Date().toISOString()
        },
        timestamp: new Date().toISOString(),
        status: 'pending'
      }
    ];

    res.status(200).json({
      success: true,
      history: mockHistory
    });
  } catch (error) {
    console.error('Get scan history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get scan history'
    });
  }
});

// @desc    Approve entry
// @route   POST /api/qr-scanner/approve
// @access  Private (Admin only)
router.post('/approve/:scanId', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin access required.'
      });
    }

    const { scanId } = req.params;
    
    // In a real app, this would update database
    // For demo, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Entry approved successfully',
      scanId,
      approvedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Approve entry error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to approve entry'
    });
  }
});

// @desc    Reject entry
// @route   POST /api/qr-scanner/reject
// @access  Private (Admin only)
router.post('/reject/:scanId', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin access required.'
      });
    }

    const { scanId } = req.params;
    
    res.status(200).json({
      success: true,
      message: 'Entry rejected successfully',
      scanId,
      rejectedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Reject entry error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reject entry'
    });
  }
});

module.exports = router;
