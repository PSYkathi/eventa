// const express = require('express')
// const router = express.Router()
// const{updateUserProfile} = require('../controllers/userControllers');
// const{protect} = require('../middleware/authmiddleware')

// // it is said that this router is protected. the 'protect' gaurd runs first.

// router.put('/profile',protect,updateUserProfile);

// module.exports = router;




// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { updateUserProfile, getUserProfile } = require('../controllers/userController'); // Import both
const { protect } = require('../middleware/authMiddleware');

// Read Profile (GET) and Update Profile (PUT)
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;