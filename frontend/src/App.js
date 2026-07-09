import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import MyApplications from './pages/MyApplications';
import ManageApplications from './pages/ManageApplications';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import JobChatPage from './pages/JobChatPage';  // ← NEW
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';

// Context
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requireAdmin && user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/jobs" element={<Layout><Jobs /></Layout>} />
          <Route path="/jobs/:id" element={<Layout><JobDetails /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout><Profile /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-job"
            element={
              <ProtectedRoute>
                <Layout><CreateJob /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute>
                <Layout><MyApplications /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage-applications/:jobId"
            element={
              <ProtectedRoute>
                <Layout><ManageApplications /></Layout>
              </ProtectedRoute>
            }
          />
          {/* Global Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Layout><Chat /></Layout>
              </ProtectedRoute>
            }
          />
          {/* Job-Specific Chat - NEW */}
          <Route
            path="/chat/job/:applicationId"
            element={
              <ProtectedRoute>
                <Layout><JobChatPage /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Layout><AdminDashboard /></Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ChatProvider>
  );
}

export default App;