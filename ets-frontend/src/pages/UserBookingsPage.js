import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function UserBookingsPage() {
  const { user, token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [msg, setMsg] = useState('');

  // Fetch user's bookings
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await axios.get('/api/v1/users/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data.bookings);
      } catch (err) {
        setMsg('Failed to fetch bookings');
      }
    }
    fetchBookings();
  }, [token]);

  // Cancel a booking
  const handleCancel = async (id) => {
    setMsg('');
    try {
      await axios.delete(`/api/v1/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking canceled');
      setBookings(bookings.filter(b => b._id !== id));
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  return (
    <div>
      <h2>My Bookings</h2>
      {msg && <div>{msg}</div>}
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        bookings.map(booking => (
          <div key={booking._id} style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}>
            <p><strong>Event:</strong> {booking.event.title}</p>
            <p><strong>Quantity:</strong> {booking.quantity}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p><strong>Status:</strong> {booking.status}</p>
            {booking.status !== "Canceled" && (
              <button onClick={() => handleCancel(booking._id)}>
                Cancel Booking
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default UserBookingsPage;
