// server/models/Invitation.js
const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  // Who sent the invite? (The Boss)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Who are we inviting?
  email: {
    type: String,
    required: true
  },
  // What job are we offering?
  role: {
    type: String,
    default: 'employee'
  },
  specialization: { // e.g., "Photographer"
    type: String, 
    required: true
  },
  // The Golden Ticket Code
  token: {
    type: String,
    required: true
  },
  // Status
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Expired'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 2 // Document auto-deletes after 2 days (Security)
  }
});

module.exports = mongoose.model('Invitation', InvitationSchema);