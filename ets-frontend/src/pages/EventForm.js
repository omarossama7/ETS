import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

function EventForm() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); // undefined for new events
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    tickets: '',
    price: '',
  });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (isEdit) {
      // Fetch existing event
      axios.get(`/api/v1/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const e = res.data.event;
        setForm({
          title: e.title,
          date: e.date.slice(0, 10), // for input[type=date]
          location: e.location,
          tickets: e.tickets,
          price: e.price,
        });
      }).catch(() => setMsg('Failed to load event'));
    }
  }, [isEdit, id, token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      if (isEdit) {
        await axios.put(`/api/v1/events/${id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event updated!');
      } else {
        await axios.post('/api/v1/events', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Event created!');
      }
      navigate('/my-events');
    } catch {
      toast.error('Save failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? "Edit" : "Create"} Event</h2>
      {msg && <div>{msg}</div>}
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
      <input name="date" value={form.date} onChange={handleChange} type="date" required />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
      <input name="tickets" value={form.tickets} onChange={handleChange} type="number" min="1" required />
      <input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" required />
      <button type="submit">{isEdit ? "Update" : "Create"}</button>
    </form>
  );
}

export default EventForm;
