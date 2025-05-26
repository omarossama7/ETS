const Event = require('../models/Event');

// Create a new event (Organizer)
exports.createEvent = async (req, res) => {
    try {
        const event = await Event.create({ ...req.body, organizer: req.user.id });
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all events (Public)
exports.getAllEvents = async (req, res) => {
    const events = await Event.find({ status: 'approved' });
    res.json(events);
};

// Get single event by ID (Public)
exports.getEventById = async (req, res) => {
    const event = await Event.findById(req.params.id).populate('organizer');
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
};

// Update event (Organizer or Admin)
exports.updateEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
};

// Delete event (Organizer or Admin)
exports.deleteEvent = async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (event.organizer.toString() !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
};

// Approve/Reject event (Admin only)
exports.changeEventStatus = async (req, res) => {
    if (req.user.role !== 'Admin') return res.status(403).json({ error: 'Unauthorized' });

    const event = await Event.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
    );
    res.json(event);
};

// Get current user's events (Organizer)
exports.getUserEvents = async (req, res) => {
    const events = await Event.find({ organizer: req.user.id });
    res.json(events);
};

// Get event analytics (Organizer)
exports.getUserEventAnalytics = async (req, res) => {
    const totalEvents = await Event.countDocuments({ organizer: req.user.id });
    const approved = await Event.countDocuments({ organizer: req.user.id, status: 'approved' });
    const pending = await Event.countDocuments({ organizer: req.user.id, status: 'pending' });
    const declined = await Event.countDocuments({ organizer: req.user.id, status: 'declined' });

    const events = await Event.find({ organizer: req.user.id });

    let totalTickets = 0;
    let remainingTickets = 0;

    events.forEach(event => {
        totalTickets += event.totalTickets;
        remainingTickets += event.remainingTickets;
    });

    const purchasedTickets = totalTickets - remainingTickets;

    res.json({
        totalEvents,
        approved,
        pending,
        declined,
        purchasedTickets,
        remainingTickets
    });
};

