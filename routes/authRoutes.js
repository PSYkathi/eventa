const express = require('express')
const router = express.Router()

const {registerUser, loginUser} = require('../controllers/authController');


// Define the path: POST /api/auth/register
//  when someone posts data to '/register', run the 'registerUser' function

router.post('/register',registerUser);
router.post('/login',loginUser);

module.exports = router;
