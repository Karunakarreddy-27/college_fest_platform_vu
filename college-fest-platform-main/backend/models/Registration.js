const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: [true, 'Event ID is required']
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'confirmed', 'cancelled', 'completed'],
    default: 'registered'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentId: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  },
  participantDetails: {
    teamName: {
      type: String,
      default: null
    },
    teamMembers: [{
      name: String,
      email: String,
      phone: String
    }],
    individualDetails: {
      experience: String,
    }
  },
  qrCode: {
    type: String,
    default: null
  },
  checkInStatus: {
    type: Boolean,
    default: false
  },
  checkInTime: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate registrations
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Index for better query performance
registrationSchema.index({ user: 1 });
registrationSchema.index({ event: 1 });
registrationSchema.index({ status: 1 });

// Pre-save middleware to update event participant count
registrationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Event = mongoose.model('Event');
    await Event.findByIdAndUpdate(this.event, {
      $inc: { currentParticipants: 1 }
    });
  }
  next();
});

// Pre-remove middleware to update event participant count
registrationSchema.pre('remove', async function(next) {
  const Event = mongoose.model('Event');
  await Event.findByIdAndUpdate(this.event, {
    $inc: { currentParticipants: -1 }
  });
  next();
});

module.exports = mongoose.model('Registration', registrationSchema);
