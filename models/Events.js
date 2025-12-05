// server/models/Event.js
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  location: { type: String, required: true },
  eventType: { type: String, required: true },
  
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  
  budget: { type: Number, default: 0 },
  description: { type: String },

  // --- NEW: STAFF ASSIGNMENT ---
  assignedStaff: [{
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String }, // e.g., "Photographer"
    status: { type: String, enum: ['Assigned', 'Confirmed', 'Declined'], default: 'Assigned' }
  }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Event', EventSchema);





