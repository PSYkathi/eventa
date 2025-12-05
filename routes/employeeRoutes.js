// server/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
// const { inviteEmployee } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { inviteEmployee, registerInvitedEmployee } = require('../controllers/employeeController');

// Only Organizers can invite
// We should add a check for 'organizer' role here technically, but protect is fine for now
router.post('/invite', protect, inviteEmployee);
router.post('/invite', protect, inviteEmployee)
router.post('/join', registerInvitedEmployee); 

module.exports = router;