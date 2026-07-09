import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaBriefcase, FaPlus, FaEye, FaComment, FaUserGraduate, FaBuilding, FaFileAlt, FaSpinner } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalStudents: 0,
    pendingApplications: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myJobs, setMyJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentApplicants, setRecentApplicants] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'CLIENT') {
        try {
          const [jobsRes, applicationsRes, statsRes] = await Promise.all([
            api.get('/jobs/my').catch(() => ({ data: { jobs: [] } })),
            api.get('/applications/my-jobs').catch(() => ({ data: { applications: [] } })),
            api.get('/jobs/stats').catch(() => ({ data: { totalJobs: 0, totalApplications: 0, pendingApplications: 0 } }))
          ]);
          setMyJobs(jobsRes.data?.jobs || []);
          setMyApplications(applicationsRes.data?.applications || []);
          setStats(statsRes.data || { totalJobs: 0, totalApplications: 0, pendingApplications: 0 });
          
          if (applicationsRes.data?.applications) {
            setRecentApplicants(applicationsRes.data.applications.slice(0, 5));
          }
        } catch (err) {
          console.log('Client dashboard data loaded with defaults');
        }
      } else if (user?.role === 'STUDENT') {
        try {
          const [jobsRes, applicationsRes, statsRes] = await Promise.all([
            api.get('/jobs').catch(() => ({ data: { jobs: [] } })),
            api.get('/applications/my').catch(() => ({ data: { applications: [] } })),
            api.get('/jobs/stats').catch(() => ({ data: { totalJobs: 0, totalStudents: 0 } }))
          ]);
          setRecentJobs(jobsRes.data?.jobs?.slice(0, 6) || []);
          setMyApplications(applicationsRes.data?.applications || []);
          setStats(statsRes.data || { totalJobs: 0, totalStudents: 0 });
        } catch (err) {
          console.log('Student dashboard data loaded with defaults');
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await api.get('/messages/unread').catch(() => ({ data: { count: 0 } }));
      setUnreadCount(response.data?.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchUnreadCount();
    } else {
      setLoading(false);
    }
  }, [user, fetchDashboardData, fetchUnreadCount]);

  const pendingCount = myApplications.filter(app => app.status === 'PENDING').length;

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'ACCEPTED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1a] flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-5xl text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // ========== STUDENT DASHBOARD ==========
  if (user?.role === 'STUDENT') {
    return (
      <div className="min-h-screen bg-[#0f0a1a] py-8">
        <div className="container-custom max-w-6xl">
          {/* Welcome Section */}
          <div className="glass-card rounded-3xl p-8 mb-8 border border-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold">
                  Welcome back, <span className="gradient-text">{user.name}</span>! 👋
                </h1>
                <p className="text-gray-400 mt-2 flex items-center gap-2">
                  <FaUserGraduate className="text-purple-400" />
                  {user.university || 'Student'} • {user.course || 'No course specified'}
                </p>
              </div>
              <div className="hidden md:block text-6xl">🎓</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-2xl font-bold text-purple-400">{stats.totalJobs || 0}</div>
              <div className="text-gray-400 text-sm">Available Jobs</div>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-blue-400">{myApplications.length}</div>
              <div className="text-gray-400 text-sm">My Applications</div>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-yellow-400">
                {myApplications.filter(a => a.status === 'PENDING').length}
              </div>
              <div className="text-gray-400 text-sm">Pending Review</div>
            </div>
            <div 
              className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-105" 
              onClick={() => navigate('/chat')}
            >
              <div className="text-3xl mb-2 relative">💬</div>
              <div className="text-2xl font-bold text-purple-400">
                {unreadCount > 0 ? (
                  <span className="relative">
                    {unreadCount}
                    <span className="absolute -top-1 -right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </span>
                ) : '0'}
              </div>
              <div className="text-gray-400 text-sm">Unread Messages</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/jobs" className="btn-primary text-center py-3 flex items-center justify-center gap-2">
              <FaBriefcase /> Browse Jobs
            </Link>
            <Link to="/my-applications" className="btn-secondary text-center py-3 flex items-center justify-center gap-2">
              <FaFileAlt /> My Applications
            </Link>
            <Link to="/chat" className="btn-secondary text-center py-3 flex items-center justify-center gap-2">
              <FaComment /> Messages
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="btn-secondary text-center py-3 flex items-center justify-center gap-2">
              <FaUserGraduate /> Profile
            </Link>
          </div>

          {/* Recent Jobs */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">🔍 Recent Jobs</h2>
              <Link to="/jobs" className="text-purple-400 hover:text-purple-300 text-sm">View All →</Link>
            </div>
            {recentJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No jobs available right now.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition border border-white/5 hover:border-purple-500/30">
                    <Link to={`/jobs/${job.id}`}>
                      <h3 className="font-bold text-white hover:text-purple-400">{job.title}</h3>
                    </Link>
                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">{job.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-purple-400 font-semibold">${job.budget}</span>
                      <span className="text-xs text-gray-500">{job.category}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500">Posted by {job.client?.name}</span>
                      <Link to={`/jobs/${job.id}`} className="text-purple-400 hover:text-purple-300">
                        <FaEye /> View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== CLIENT DASHBOARD ==========
  if (user?.role === 'CLIENT') {
    return (
      <div className="min-h-screen bg-[#0f0a1a] py-8">
        <div className="container-custom max-w-6xl">
          {/* Welcome Section */}
          <div className="glass-card rounded-3xl p-8 mb-8 border border-purple-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold">
                  Welcome back, <span className="gradient-text">{user.name}</span>! 👋
                </h1>
                <p className="text-gray-400 mt-2 flex items-center gap-2">
                  <FaBuilding className="text-purple-400" />
                  {user.company || 'Company not specified'}
                </p>
              </div>
              <div className="hidden md:block text-6xl">💼</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-3xl mb-2">📋</div>
              <div className="text-2xl font-bold text-purple-400">{myJobs.length}</div>
              <div className="text-gray-400 text-sm">My Jobs</div>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-2xl font-bold text-blue-400">{myApplications.length}</div>
              <div className="text-gray-400 text-sm">Total Applicants</div>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300">
              <div className="text-3xl mb-2">⏳</div>
              <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
              <div className="text-gray-400 text-sm">Pending Review</div>
            </div>
            <div 
              className="glass-card rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300 cursor-pointer hover:scale-105" 
              onClick={() => navigate('/chat')}
            >
              <div className="text-3xl mb-2 relative">💬</div>
              <div className="text-2xl font-bold text-purple-400">
                {unreadCount > 0 ? (
                  <span className="relative">
                    {unreadCount}
                    <span className="absolute -top-1 -right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </span>
                ) : '0'}
              </div>
              <div className="text-gray-400 text-sm">Unread Messages</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link to="/create-job" className="btn-primary text-center py-3 flex items-center justify-center gap-2">
              <FaPlus /> Post a Job
            </Link>
            <Link to="/jobs/my" className="btn-secondary text-center py-3 flex items-center justify-center gap-2">
              <FaBriefcase /> My Jobs
            </Link>
            <Link to="/chat" className="btn-secondary text-center py-3 flex items-center justify-center gap-2">
              <FaComment /> Messages
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="btn-secondary text-center py-3 flex items-center justify-center gap-2">
              <FaBuilding /> Profile
            </Link>
          </div>

          {/* Recent Applicants */}
          <div className="glass-card rounded-3xl p-6 border border-purple-500/10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">👥 Recent Applicants</h2>
              <Link to="/jobs/my" className="text-purple-400 hover:text-purple-300 text-sm">View All →</Link>
            </div>
            {recentApplicants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No applications yet. Post a job to get started!</p>
            ) : (
              <div className="space-y-3">
                {recentApplicants.map((app) => (
                  <div key={app.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition border border-white/5 hover:border-purple-500/30 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {app.student?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-white">{app.student?.name}</p>
                        <p className="text-sm text-gray-400">{app.job?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                      <div className="flex gap-2">
                        <Link 
                          to={`/chat/job/${app.id}`}
                          className="text-purple-400 hover:text-purple-300 transition p-2"
                          title="Chat with applicant"
                        >
                          <FaComment size={18} />
                        </Link>
                        <Link 
                          to={`/manage-applications/${app.jobId}`}
                          className="text-blue-400 hover:text-blue-300 transition p-2"
                          title="Manage application"
                        >
                          <FaEye size={18} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Jobs Quick View */}
          {myJobs.length > 0 && (
            <div className="glass-card rounded-3xl p-6 mt-6 border border-purple-500/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">📋 My Jobs</h2>
                <Link to="/jobs/my" className="text-purple-400 hover:text-purple-300 text-sm">View All →</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition border border-white/5 hover:border-purple-500/30">
                    <Link to={`/jobs/${job.id}`}>
                      <h3 className="font-bold text-white hover:text-purple-400">{job.title}</h3>
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-purple-400 font-semibold">${job.budget}</span>
                      <span className="text-sm text-gray-500">{job.status}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link 
                        to={`/jobs/${job.id}`}
                        className="text-xs bg-white/10 hover:bg-white/20 text-gray-300 px-3 py-1 rounded-full transition"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/manage-applications/${job.id}`}
                        className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-1 rounded-full transition"
                      >
                        Applicants
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ========== FALLBACK - NOT LOGGED IN ==========
  return (
    <div className="min-h-screen bg-[#0f0a1a] flex items-center justify-center py-8">
      <div className="container-custom max-w-4xl">
        <div className="glass-card rounded-3xl p-12 text-center border border-purple-500/10">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to Your Dashboard</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
            Please log in or create an account to access your personalized dashboard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="btn-primary px-8 py-3 text-lg">
              <i className="fa-solid fa-sign-in-alt mr-2"></i> Login
            </Link>
            <Link to="/register" className="btn-secondary px-8 py-3 text-lg">
              <i className="fa-solid fa-user-plus mr-2"></i> Register
            </Link>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Don't have an account? <Link to="/register" className="text-purple-400 hover:text-purple-300">Create one now</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;