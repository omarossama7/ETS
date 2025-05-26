import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function AdminEventsPage() {
  const { token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get('/api/v1/events/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvents(res.data.events);
      } catch {
        toast.error('Failed to fetch events');
      }
    }
    fetchEvents();
  }, [token]);

  // Approve or Decline
  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/api/v1/events/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(events.map(ev =>
        ev._id === id ? { ...ev, status } : ev
      ));
    } catch {
      toast.error('Action failed');
    }
  };

  // Filtering
  const filtered = filter === 'all'
    ? events
    : events.filter(e => e.status === filter);

  return (
    <div>
      <h2>Admin - All Events</h2>
      <div>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('approved')}>Approved</button>
        <button onClick={() => setFilter('pending')}>Pending</button>
        <button onClick={() => setFilter('declined')}>Declined</button>
      </div>
      {msg && <div>{msg}</div>}
      {filtered.length === 0 ? (
        <p>No events found.</p>
      ) : (
        filtered.map(event => (
          <div key={event._id} style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}>
            <h3>{event.title}</h3>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>
            <p>Status: {event.status}</p>
            {event.status === "pending" && (
              <>
                <button onClick={() => handleStatus(event._id, "approved")}>Approve</button>
                <button onClick={() => handleStatus(event._id, "declined")}>Decline</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default AdminEventsPage;
