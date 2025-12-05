// server/controllers/leaveController.js
const Leave = require('../models/leave');

// @desc    Employee requests leave
// @route   POST /api/leaves
const requestLeave = async (req, res) => {
  try {
    const { date, reason } = req.body;
    // req.user.employerId comes from the User Model (The Boss)
    await Leave.create({
      employee: req.user._id,
      organizer: req.user.employerId, 
      date,
      reason
    });
    res.status(201).json({ message: 'Leave Request Sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Organizer approves/rejects leave
// @route   PUT /api/leaves/:id
const updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Approved' or 'Rejected'
    const leave = await Leave.findById(req.params.id);
    
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    
    // Security: Only the boss can approve
    if (leave.organizer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    leave.status = status;
    await leave.save();
    res.json({ message: `Leave ${status}` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { requestLeave, updateLeaveStatus };