const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', eventController.getAllEvents); // GET /api/v1/events
router.get('/:id', eventController.getEventById); // GET /api/v1/events/:id

// Admin + Organizer
router.put('/:id', protect, authorize('Organizer', 'Admin'), eventController.updateEvent); // PUT /api/v1/events/:id
router.delete('/:id', protect, authorize('Organizer', 'Admin'), eventController.deleteEvent); // DELETE /api/v1/events/:id

// Admin-only
router.put('/:id/status', protect, authorize('Admin'), eventController.changeEventStatus); // PUT /api/v1/events/:id/status

// Organizer-only
router.post('/', protect, authorize('Organizer'), eventController.createEvent); // POST /api/v1/events
router.get('/users/events', protect, authorize('Organizer'), eventController.getUserEvents); // GET /api/v1/events/users/events
router.get('/users/events/analytics', protect, authorize('Organizer'), eventController.getUserEventAnalytics); // GET /api/v1/events/users/events/analytics

module.exports = router;
