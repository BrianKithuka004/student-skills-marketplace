import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FaUsers, 
  FaBriefcase, 
  FaFileAlt, 
  FaStar, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaTrash, 
  FaUserCheck,
  FaCalendarAlt,
  FaUserGraduate
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, jobsRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/jobs')
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
      setJobs(jobsRes.data.jobs || []);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}`, { 
        isVerified: !currentStatus 
      });
      toast.success(`User ${currentStatus ? 'unverified' : 'verified'}!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      toast.success(`User role updated to ${newRole}!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        toast.success('User deleted!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/admin/jobs/${jobId}`);
        toast.success('Job deleted!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete job');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card rounded-3xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { icon: FaUsers, label: 'Total Users', value: stats?.totalUsers || 0, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
    { icon: FaBriefcase, label: 'Total Jobs', value: stats?.totalJobs || 0, color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
    { icon: FaFileAlt, label: 'Applications', value: stats?.totalApplications || 0, color: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { icon: FaStar, label: 'Reviews', value: stats?.totalReviews || 0, color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container-custom max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold gradient-text">👑 Admin Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your platform users, jobs, and content</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaCalendarAlt className="text-purple-500" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`${stat.bg} p-6 rounded-2xl border border-gray-200/50 hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl mb-3`}>
                  <stat.icon />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200/50 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaUsers className="inline mr-2" />
              Users ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'jobs' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaBriefcase className="inline mr-2" />
              Jobs ({jobs.length})
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FaUserGraduate className="text-purple-500" />
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {users.slice(0, 5).map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.role}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-6 border border-gray-200/50">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-purple-500" />
                  Recent Jobs
                </h3>
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((j) => (
                    <div key={j.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div>
                        <p className="text-sm font-medium">{j.title}</p>
                        <p className="text-xs text-gray-500">${j.budget} • {j.client?.name || 'Unknown'}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        j.status === 'OPEN' ? 'bg-green-100 text-green-700' : 
                        j.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {j.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="p-3 text-left">User</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Verified</th>
                    <th className="p-3 text-left">Rating</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">{u.email}</td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => updateUserRole(u.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-purple-500 ${
                            u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                            u.role === 'CLIENT' ? 'bg-purple-100 text-purple-700' : 
                            'bg-green-100 text-green-700'
                          }`}
                        >
                          <option value="STUDENT">Student</option>
                          <option value="CLIENT">Client</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => toggleVerification(u.id, u.isVerified)}
                          className={`p-1 rounded-lg transition-colors ${
                            u.isVerified ? 'text-green-500 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={u.isVerified ? 'Click to unverify' : 'Click to verify'}
                        >
                          {u.isVerified ? <FaCheckCircle className="text-lg" /> : <FaTimesCircle className="text-lg" />}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span>{u.rating?.toFixed(1) || '0'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {u.role !== 'ADMIN' && (
                            <>
                              <button
                                onClick={() => toggleVerification(u.id, u.isVerified)}
                                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-xs"
                                title={u.isVerified ? 'Unverify' : 'Verify'}
                              >
                                <FaUserCheck className="text-sm" />
                              </button>
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-xs"
                                title="Delete user"
                              >
                                <FaTrash className="text-sm" />
                              </button>
                            </>
                          )}
                          {u.role === 'ADMIN' && (
                            <span className="text-xs text-gray-400 px-2 py-1">Protected</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Client</th>
                    <th className="p-3 text-left">Budget</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => (
                    <tr key={j.id} className="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                      <td className="p-3 font-medium">{j.title}</td>
                      <td className="p-3 text-gray-600">{j.client?.name || 'Unknown'}</td>
                      <td className="p-3 font-semibold text-purple-600">${j.budget}</td>
                      <td className="p-3">
                        <span className="badge badge-primary">{j.category}</span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          j.status === 'OPEN' ? 'bg-green-100 text-green-700' : 
                          j.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {j.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => deleteJob(j.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-xs"
                          title="Delete job"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;