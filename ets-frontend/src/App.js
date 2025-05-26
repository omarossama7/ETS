import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import UserBookingsPage from './pages/UserBookingsPage';
import MyEventsPage from './pages/MyEventsPage';
import EventForm from './pages/EventForm';
import EventAnalytics from './pages/EventAnalytics';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Optionally import your NotFound and UnauthorizedPage if you made them
// import NotFound from './pages/NotFound';
// import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<EventList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/events/:id" element={<EventDetails />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <UserBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Organizer routes */}
        <Route
          path="/my-events"
          element={
            <ProtectedRoute role="organizer">
              <MyEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events/new"
          element={
            <ProtectedRoute role="organizer">
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events/:id/edit"
          element={
            <ProtectedRoute role="organizer">
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-events/analytics"
          element={
            <ProtectedRoute role="organizer">
              <EventAnalytics />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role="admin">
              <AdminEventsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />

        {/* Optionally add 404/unauthorized */}
        {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;





  //"homepage": "https://omarossama7.github.io/ETS",
