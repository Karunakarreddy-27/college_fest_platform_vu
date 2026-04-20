const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  type: {
    type: String,
    enum: ['fest_fee', 'event_registration'],
    required: [true, 'Payment type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'wallet'],
    default: 'upi'
  },
  transactionId: {
    type: String,
    required: [true, 'Transaction ID is required'],
    unique: true
  },
  gatewayTransactionId: {
    type: String,
    default: null
  },
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  description: {
    type: String,
    required: [true, 'Payment description is required']
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    default: null
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    default: null
  },
  refundAmount: {
    type: Number,
    default: 0
  },
  refundDate: {
    type: Date,
    default: null
  },
  refundReason: {
    type: String,
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  },
  failureReason: {
    type: String,
    default: null
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ type: 1 });

// Pre-save middleware to set processedAt when payment is completed
paymentSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
