import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const { register, loading } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ensure axios sends JSON properly
  useEffect(() => {
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('➡️ Registering with:', form); // 🔍 Debug log

    const res = await register(form);
    if (res.success) {
      navigate('/login');
    } else {
      setError(res.message);
      console.error('❌ Register failed:', res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Register</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <input
        name="password"
        value={form.password}
        onChange={handleChange}
        type="password"
        placeholder="Password"
        required
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      />
      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        style={{ width: '100%', padding: 8, marginBottom: 10 }}
      >
        <option value="user">User</option>
        <option value="organizer">Organizer</option>
      </select>

      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}

      <button type="submit" disabled={loading} style={{ width: '100%', padding: 10 }}>
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
