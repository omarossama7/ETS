import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function Profile() {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get('/api/v1/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data.user);
        setForm({ name: res.data.user.name, email: res.data.user.email, password: '' });
      } catch (err) {
        toast.error('Failed to fetch profile');
      }
    }
    fetchProfile();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await axios.put('/api/v1/users/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data.user);
      setEdit(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>My Profile</h2>
      {msg && <div>{msg}</div>}
      {!edit ? (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <button onClick={() => setEdit(true)}>Edit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleChange} required />
          <input name="email" value={form.email} onChange={handleChange} required />
          <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="New password (optional)" />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEdit(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}

export default Profile;
