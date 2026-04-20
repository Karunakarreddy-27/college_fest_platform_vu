const express = require('express');
const validator = require('validator');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const rawName = req.body?.name;
    const rawEmail = req.body?.email;
    const rawSubject = req.body?.subject;
    const rawMessage = req.body?.message;

    if (
      typeof rawName !== 'string' ||
      typeof rawEmail !== 'string' ||
      typeof rawSubject !== 'string' ||
      typeof rawMessage !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject and message are required'
      });
    }

    const name = rawName.trim();
    const email = rawEmail.trim().toLowerCase();
    const subject = rawSubject.trim();
    const message = rawMessage.trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject and message are required'
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const savedMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message,
      source: 'contact_form',
      ipAddress: req.ip || null,
      userAgent: req.get('user-agent') || null
    });

    return res.status(201).json({
      success: true,
      message: 'Message submitted successfully',
      id: savedMessage._id
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit message'
    });
  }
});

module.exports = router;
