const express = require('express')
const router = express.Router()
const {createEvent, getMyEvents} = require('../controllers/eventController')
const {protect} = require('../middleware/authmiddleware')
const { route } = require('./authRoutes')

router.post('/',protect,createEvent);
router.get('/',protect,getMyEvents)

module.exports = router;