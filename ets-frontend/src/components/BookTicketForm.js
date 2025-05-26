import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function BookTicketForm({ event }) {
  const { user, token } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);

  const handleBook = async () => {
    try {
      await axios.post('/api/v1/bookings', {
        eventId: event._id,
        quantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Booking successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div>
      <h4>Book Tickets</h4>
      <input
        type="number"
        min="1"
        max={event.tickets - event.ticketsBooked}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button onClick={handleBook}>Book</button>
    </div>
  );
}

export default BookTicketForm;