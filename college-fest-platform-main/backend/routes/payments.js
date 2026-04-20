const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const QRCode = require('qrcode');

const FEST_FEE_AMOUNT = 500;

const buildTransactionId = (prefix) => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const getManualPaymentConfig = () => {
  const upiId = process.env.MANUAL_PAYMENT_UPI_ID || 'collegefest@upi';
  const payeeName = process.env.MANUAL_PAYMENT_PAYEE_NAME || 'College Fest';

  return {
    upiId,
    payeeName,
    amount: FEST_FEE_AMOUNT,
    upiUrl: `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${FEST_FEE_AMOUNT}&cu=INR`
  };
};

const getPaymentResponse = (payment) => ({
  id: payment._id,
  transactionId: payment.transactionId,
  utrNumber: payment.gatewayTransactionId,
  amount: payment.amount,
  status: payment.status,
  type: payment.type,
  processedAt: payment.processedAt,
  failureReason: payment.failureReason
});

const syncUserFestFeeStatus = async (payment, user) => {
  if (payment.type !== 'fest_fee') {
    return user;
  }

  if (payment.status === 'completed' && user.paymentStatus !== 'paid') {
    return User.findByIdAndUpdate(
      user._id,
      {
        paymentStatus: 'paid',
        paymentId: payment._id.toString(),
        paymentAmount: payment.amount
      },
      { new: true }
    );
  }

  if (payment.status === 'failed' && user.paymentStatus === 'pending') {
    return User.findByIdAndUpdate(
      user._id,
      { paymentStatus: 'failed' },
      { new: true }
    );
  }

  return user;
};

// @desc    Get manual UPI QR payment details
// @route   GET /api/payments/manual/qr
// @access  Private
router.get('/manual/qr', protect, async (req, res) => {
  try {
    const config = getManualPaymentConfig();
    const qrCode = await QRCode.toDataURL(config.upiUrl);

    res.status(200).json({
      success: true,
      payment: {
        ...config,
        qrCode
      }
    });
  } catch (error) {
    console.error('Manual QR generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate payment QR'
    });
  }
});

  // @desc    Submit one-time fest fee payment proof
// @route   POST /api/payments/manual/fest-fee
// @access  Private
const submitFestFee = async (req, res) => {
  try {
    const userId = req.user.id;
    const { utrNumber, screenshotDataUrl, notes = '' } = req.body;

    if (!utrNumber || !utrNumber.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the UTR number'
      });
    }

    if (!screenshotDataUrl || !screenshotDataUrl.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid payment screenshot'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Fest payment is already completed for your account'
      });
    }

    const existingUtrPayment = await Payment.findOne({
      gatewayTransactionId: utrNumber.trim(),
      status: { $ne: 'failed' }
    });

    if (existingUtrPayment) {
      return res.status(400).json({
        success: false,
        message: 'This UTR number has already been submitted'
      });
    }

    const existingActivePayment = await Payment.findOne({
      user: userId,
      type: 'fest_fee',
      'metadata.provider': 'manual_qr',
      status: { $in: ['pending', 'processing', 'completed'] }
    }).sort({ createdAt: -1 });

    if (existingActivePayment) {
      return res.status(400).json({
        success: false,
        message: existingActivePayment.status === 'completed'
          ? 'Fest payment is already completed for your account'
          : 'You already submitted fest payment proof. Please wait for admin verification.'
      });
    }

    const transactionId = buildTransactionId('FEST');

    const payment = await Payment.create({
      user: userId,
      type: 'fest_fee',
      amount: FEST_FEE_AMOUNT,
      currency: 'INR',
      paymentMethod: 'upi',
      transactionId,
      description: 'One-time college fest access fee',
      gatewayTransactionId: utrNumber.trim(),
      status: 'pending',
      metadata: {
        provider: 'manual_qr',
        utrNumber: utrNumber.trim(),
        screenshotDataUrl,
        notes: notes.trim(),
        submittedAt: new Date()
      }
    });

    await User.findByIdAndUpdate(userId, {
      paymentStatus: 'pending',
      paymentAmount: FEST_FEE_AMOUNT
    });

    res.status(201).json({
      success: true,
      message: 'Payment proof submitted. Your fest payment will be verified by admin.',
      payment: getPaymentResponse(payment)
    });
  } catch (error) {
    console.error('Manual fest fee submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit payment proof'
    });
  }
};

router.post('/manual/fest-fee', protect, submitFestFee);

// Backward-compatible alias for older frontend builds.
router.post('/manual/event-registration', protect, submitFestFee);

// @desc    Get latest fest fee payment status
// @route   GET /api/payments/manual/fest-fee/status
// @access  Private
router.get('/manual/fest-fee/status', protect, async (req, res) => {
  try {
    const latestPayment = await Payment.findOne({
      user: req.user.id,
      type: 'fest_fee',
      'metadata.provider': 'manual_qr'
    }).sort({ createdAt: -1 });

    let user = await User.findById(req.user.id);

    if (latestPayment) {
      user = await syncUserFestFeeStatus(latestPayment, user);
    }

    res.status(200).json({
      success: true,
      payment: latestPayment ? getPaymentResponse(latestPayment) : null,
      user: {
        paymentStatus: user.paymentStatus,
        paymentId: user.paymentId,
        paymentAmount: user.paymentAmount,
        qrCode: user.qrCode
      }
    });
  } catch (error) {
    console.error('Get fest fee payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payment status'
    });
  }
});

// @desc    Get payment status with real-time updates
// @route   GET /api/payments/:transactionId/status
// @access  Private
router.get('/:transactionId/status', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      transactionId: req.params.transactionId,
      user: req.user.id
    }).populate('user', 'name email paymentStatus');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    let updatedUser = await User.findById(req.user.id);
    updatedUser = await syncUserFestFeeStatus(payment, updatedUser);

    res.status(200).json({
      success: true,
      payment: getPaymentResponse(payment),
      user: {
        paymentStatus: updatedUser.paymentStatus,
        paymentId: updatedUser.paymentId,
        paymentAmount: updatedUser.paymentAmount,
        qrCode: updatedUser.qrCode
      }
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payment status'
    });
  }
});

// @desc    Get user's payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('eventId', 'name date')
      .populate('registrationId', 'status');

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payment history'
    });
  }
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private (Admin only)
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const stats = await Payment.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          total: { $sum: '$amount' }
        }
      }
    ]);

    const festFeePayments = await Payment.countDocuments({ type: 'fest_fee', status: 'completed' });
    const eventPayments = await Payment.countDocuments({ type: 'event_registration', status: 'completed' });
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        byStatus: stats,
        festFeePayments,
        eventPayments,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get payment statistics'
    });
  }
});

module.exports = router;
