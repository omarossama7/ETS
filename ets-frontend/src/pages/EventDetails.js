import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import BookTicketForm from '../components/BookTicketForm';
function EventDetails() {
  const { id } = useParams();
  const { user, token } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await axios.get(`/api/v1/events/${id}`);
        setEvent(res.data.event);
      } catch {
        setMsg('Event not found');
      }
    }
    fetchEvent();
  }, [id]);

  if (!event) return <div>Loading... {msg && <span>{msg}</span>}</div>;

  const available = event.tickets - event.ticketsBooked;

  // Only show booking form if user is logged in and tickets are available
  const handleBook = async (e) => {
    e.preventDefault();
    setMsg('');
    if (quantity > available) {
      setMsg('Not enough tickets available!');
      return;
    }
    try {
      await axios.post('/api/v1/bookings', {
        eventId: event._id,
        quantity
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Booking successful!');
      navigate('/bookings'); // Go to user bookings page
    } catch (err) {
toast.error(err.response?.data?.message || 'Booking failed');    }
  };

  return (
    <div>
      <h2>{event.title}</h2>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Price: ${event.price}</p>
      <p>Status: {event.status}</p>
      <p>
        {available === 0
          ? <span style={{ color: 'red' }}>Sold Out</span>
          : available <= 5
            ? <span style={{ color: 'orange' }}>Only {available} tickets left!</span>
            : <span>{available} tickets left</span>
        }
      </p>
      {msg && <div>{msg}</div>}
      {user && available > 0 && (
        <form onSubmit={handleBook}>
          <label>
            Quantity:
            <input
              type="number"
              min="1"
              max={available}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              required
            />
          </label>
          <p>Total: ${quantity * event.price}</p>
          <button type="submit">Book Ticket</button>
        </form>
      )}
      {!user && <p><b>Login to book tickets.</b></p>}
    </div>
  );
  <BookTicketForm event={event} />
}

export default EventDetails;
