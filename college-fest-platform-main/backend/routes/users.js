const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, college } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, college },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
});

// @desc    Get user QR code
// @route   GET /api/users/qrcode
// @access  Private
router.get('/qrcode', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('qrCode paymentStatus');
    
    if (!user.qrCode && user.paymentStatus === 'paid') {
      // Generate QR code if it doesn't exist but user has paid
      const QRCode = require('qrcode');
      const qrData = JSON.stringify({
        userId: user._id,
        name: user.name,
        email: user.email,
        paymentStatus: user.paymentStatus,
        timestamp: new Date().toISOString()
      });

      const qrCode = await QRCode.toDataURL(qrData);
      user.qrCode = qrCode;
      await user.save();
    }

    res.status(200).json({
      success: true,
      qrCode: user.qrCode
    });
  } catch (error) {
    console.error('Get QR code error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get QR code'
    });
  }
});

module.exports = router;
