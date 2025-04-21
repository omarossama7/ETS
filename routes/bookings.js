const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking
} = require('../controllers/bookings');

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.route('/:id')
  .get(protect, getBooking)
  .delete(protect, cancelBooking);

module.exports = router; 