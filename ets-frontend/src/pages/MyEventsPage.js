import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function MyEventsPage() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMyEvents() {
      try {
        const res = await axios.get('/api/v1/users/events', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data.events);
      } catch {
        toast.error('Failed to fetch your events');
      }
    }
    fetchMyEvents();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await axios.delete(`/api/v1/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.filter(e => e._id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <h2>My Events</h2>
      <Link to="/my-events/new"><button>Create New Event</button></Link>
      {msg && <div>{msg}</div>}
      {events.length === 0 ? (
        <p>No events created yet.</p>
      ) : (
        events.map(event => (
          <div key={event._id} style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}>
            <h3>{event.title}</h3>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Status: {event.status}</p>
            <Link to={`/my-events/${event._id}/edit`}><button>Edit</button></Link>
            <button onClick={() => handleDelete(event._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyEventsPage;
