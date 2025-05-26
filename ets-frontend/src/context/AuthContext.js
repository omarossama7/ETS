import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(false);

  // Save user/token in localStorage for persistence
  useEffect(() => {
    if (user && token) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user, token]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/users/login', { email, password });

      // Adjusted to match backend response format
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      });
      setToken(res.data.token);

      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    setToken('');
    // Optionally call backend /logout if implemented
    await axios.get('/api/v1/logout').catch(() => {});
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Registration function
  const register = async (userData) => {
    setLoading(true);
    try {
      await axios.post('/api/v1/users/register', userData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.response?.data?.message || 'Registration failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
