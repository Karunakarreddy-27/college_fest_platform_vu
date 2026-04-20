const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide event name'],
    trim: true,
    maxlength: [100, 'Event name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide event category'],
    enum: ['Sports', 'Games', 'Athletics'],
    default: 'Sports'
  },
  subCategory: {
    type: String,
    required: [true, 'Please provide sub-category'],
    enum: [
      // Sports
      'Cricket', 'Football', 'Volleyball', 'Kabaddi', 'Kho Kho',
      // Games
      'Chess', 'Table Tennis', 'Badminton',
      // Athletics
      '100m Race', '400m Race', 'Relay Race', 'Long Jump', 'Shot Put'
    ]
  },
  posterImage: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Event+Poster'
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide event time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide valid time in HH:MM format']
  },
  venue: {
    type: String,
    required: [true, 'Please provide event venue'],
    maxlength: [100, 'Venue cannot exceed 100 characters']
  },
  prizePool: {
    type: Number,
    required: [true, 'Please provide prize pool'],
    min: [0, 'Prize pool cannot be negative']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please provide maximum participants'],
    min: [1, 'Maximum participants must be at least 1']
  },
  currentParticipants: {
    type: Number,
    default: 0,
    min: [0, 'Current participants cannot be negative']
  },
  registrationFee: {
    type: Number,
    default: 0,
    min: [0, 'Registration fee cannot be negative']
  },
  rules: {
    type: [String],
    default: []
  },
  requirements: {
    type: [String],
    default: []
  },
  coordinator: {
    name: {
      type: String,
      required: [true, 'Please provide coordinator name']
    },
    phone: {
      type: String,
      required: [true, 'Please provide coordinator phone'],
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit phone number']
    },
    email: {
      type: String,
      required: [true, 'Please provide coordinator email'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    }
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

// Virtual to check if registration is still open
eventSchema.virtual('isRegistrationOpen').get(function() {
  return this.currentParticipants < this.maxParticipants && this.isActive && this.status === 'upcoming';
});

// Virtual to get available spots
eventSchema.virtual('availableSpots').get(function() {
  return this.maxParticipants - this.currentParticipants;
});

// Ensure virtuals are included in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// Index for better query performance
eventSchema.index({ category: 1, subCategory: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });

module.exports = mongoose.model('Event', eventSchema);
