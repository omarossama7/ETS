const Booking = require('../models/Booking');
const Event = require('../models/Event');

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'event',
        select: 'title date location price'
      });
    res.status(200).json({ success: true, data: bookings });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'event',
      select: 'title date location price'
    });
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const createBooking = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const event = await Event.findById(req.body.event);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    if (event.availableTickets < req.body.ticketQuantity) {
      return res.status(400).json({ success: false, error: 'Not enough tickets available' });
    }
    req.body.totalPrice = event.price * req.body.ticketQuantity;
    const booking = await Booking.create(req.body);
    event.availableTickets -= req.body.ticketQuantity;
    await event.save();
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized' });
    }
    const event = await Event.findById(booking.event);
    event.availableTickets += booking.ticketQuantity;
    await event.save();
    await booking.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  cancelBooking
}; 