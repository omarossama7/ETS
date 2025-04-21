const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    ticketQuantity: {
        type: Number,
        required: [true, 'Please add number of tickets'],
        min: [1, 'Must book at least 1 ticket']
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['confirmed', 'cancelled'],
        default: 'confirmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent user from submitting more than one booking per event
BookingSchema.index({ event: 1, user: 1 }, { unique: true });

// Static method to get total price
BookingSchema.statics.getTicketPrice = async function(eventId) {
    const obj = await this.aggregate([
        {
            $match: { event: eventId }
        },
        {
            $group: {
                _id: '$event',
                totalTickets: { $sum: '$ticketQuantity' }
            }
        }
    ]);
    try {
        await this.model('Event').findByIdAndUpdate(eventId, {
            availableTickets: obj[0].totalTickets
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getTicketPrice after save
BookingSchema.post('save', function() {
    this.constructor.getTicketPrice(this.event);
});

// Call getTicketPrice before remove
BookingSchema.pre('remove', function() {
    this.constructor.getTicketPrice(this.event);
});

module.exports = mongoose.model('Booking', BookingSchema);
