const mongoose = require('mongoose');
const validator = require('validator');

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email address'
      }
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
      maxlength: [150, 'Subject cannot exceed 150 characters']
    },
    message: {
      type: String,
      required: [true, 'Please provide your message'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    source: {
      type: String,
      default: 'contact_form'
    },
    ipAddress: {
      type: String,
      default: null
    },
    userAgent: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
