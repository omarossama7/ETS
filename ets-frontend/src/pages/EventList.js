import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function EventList() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get('/api/v1/events');
        setEvents(res.data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filtered = events.filter(event =>
    event.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading events...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Approved Events</h2>
      <input
        placeholder="Search events"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 10, padding: 5, width: '100%', maxWidth: 300 }}
      />
      <div>
        {filtered.length === 0 ? (
          <p>No matching events found.</p>
        ) : (
          filtered.map(event => (
            <div key={event._id} style={{ border: '1px solid #ddd', margin: 10, padding: 10 }}>
              <Link to={`/events/${event._id}`}>
                <h3>{event.title}</h3>
              </Link>
              <p>Date: {event.date}</p>
              <p>Location: {event.location}</p>
              <p>Price: ${event.price}</p>
              <p>Status: {event.status}</p>
              <p>Tickets Left: {event.tickets - event.ticketsBooked}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EventList;
