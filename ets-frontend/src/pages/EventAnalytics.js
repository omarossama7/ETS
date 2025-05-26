import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function EventAnalytics() {
  const { token } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await axios.get('/api/v1/users/events/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Expect array of { eventName, percentBooked }
        setAnalytics(res.data.analytics);
      } catch {
        setAnalytics([]);
      }
    }
    fetchAnalytics();
  }, [token]);

  if (analytics.length === 0) return <div>No analytics to show.</div>;

  return (
    <div>
      <h2>Event Booking Analytics</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={analytics}>
          <XAxis dataKey="eventName" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="percentBooked" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default EventAnalytics;
