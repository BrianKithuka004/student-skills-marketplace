import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaStar,
  FaComments,
  FaUserGraduate,
  FaUserTie,
  FaRocket,
  FaChartLine,
  FaGraduationCap,
  FaBuilding,
  FaTrophy,
  FaAward,
  FaArrowRight
} from 'react-icons/fa';

const Platforms = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
  }, []);

  const fetchPlatformStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/platform/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching platform stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const statCards = [
    { icon: FaUsers, label: 'Total Users', value: stats?.stats?.totalUsers || 0, color: 'from-blue-500 to-cyan-500', delay: 0 },
    { icon: FaBriefcase, label: 'Total Jobs', value: stats?.stats?.totalJobs || 0, color: 'from-purple-500 to-pink-500', delay: 0.1 },
    { icon: FaFileAlt, label: 'Applications', value: stats?.stats?.totalApplications || 0, color: 'from-green-500 to-emerald-500', delay: 0.2 },
    { icon: FaStar, label: 'Reviews', value: stats?.stats?.totalReviews || 0, color: 'from-yellow-500 to-amber-500', delay: 0.3 },
    { icon: FaComments, label: 'Messages', value: stats?.stats?.totalMessages || 0, color: 'from-indigo-500 to-blue-500', delay: 0.4 },
  ];

  const platforms = [
    {
      icon: FaBriefcase,
      title: 'Find Jobs',
      description: 'Browse and apply to freelance opportunities posted by students and clients',
      color: 'from-purple-500 to-pink-500',
      link: '/jobs',
      badge: `${stats?.stats?.totalJobs || 0} Jobs`
    },
    {
      icon: FaUserTie,
      title: 'Post a Job',
      description: 'Post your projects and find talented students to work with',
      color: 'from-blue-500 to-cyan-500',
      link: '/create-job',
      badge: 'Clients Only'
    },
    {
      icon: FaFileAlt,
      title: 'My Applications',
      description: 'Track all your job applications and their status',
      color: 'from-green-500 to-emerald-500',
      link: '/my-applications',
      badge: `${stats?.stats?.totalApplications || 0} Applications`
    },
    {
      icon: FaStar,
      title: 'Reviews & Ratings',
      description: 'View reviews and rate your collaborators',
      color: 'from-yellow-500 to-amber-500',
      link: '/profile',
      badge: 'Trust Building'
    },
    {
      icon: FaComments,
      title: 'Real-time Chat',
      description: 'Connect and communicate with other users instantly',
      color: 'from-indigo-500 to-blue-500',
      link: '/chat',
      badge: 'Live'
    },
    {
      icon: FaUserGraduate,
      title: 'Student Profiles',
      description: 'Showcase your skills and build your reputation',
      color: 'from-teal-500 to-green-500',
      link: '/profile',
      badge: `${stats?.stats?.totalUsers || 0} Students`
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container-custom max-w-7xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold gradient-text">🌐 Student Marketplace</h1>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            Your all-in-one platform for student freelancing, collaboration, and community
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: stat.delay }}
              className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <stat.icon className="text-3xl mb-2 opacity-80" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm opacity-80">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card rounded-3xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-2xl mb-4 shadow-lg`}>
                <platform.icon />
              </div>
              <h3 className="text-xl font-bold mb-2">{platform.title}</h3>
              <p className="text-gray-500 text-sm mb-3">{platform.description}</p>
              <div className="flex justify-between items-center">
                <span className="badge badge-primary">{platform.badge}</span>
                <Link
                  to={platform.link}
                  className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1 text-sm"
                >
                  Explore <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Students Section */}
        {stats?.topStudents?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" /> Top Rated Students
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topStudents.map((student, index) => (
                <div key={student.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                    {student.name?.charAt(0) || 'S'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{student.name}</p>
                    <p className="text-xs text-gray-500">{student.university}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-sm font-medium">{student.rating?.toFixed(1) || '0'}</span>
                      <span className="text-xs text-gray-400">({student.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${student.id}`}
                    className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Clients Section */}
        {stats?.topClients?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FaAward className="text-purple-500" /> Top Rated Clients
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.topClients.map((client, index) => (
                <div key={client.id} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                    {client.name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-xs text-gray-500">{client.university}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <FaStar className="text-yellow-400 text-xs" />
                      <span className="text-sm font-medium">{client.rating?.toFixed(1) || '0'}</span>
                      <span className="text-xs text-gray-400">({client.totalReviews || 0} reviews)</span>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${client.id}`}
                    className="text-purple-600 hover:text-purple-700 text-xs font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-12 text-center shadow-2xl">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold text-white mb-4">
                Ready to <span className="text-yellow-300">Join</span> the Community?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Start your journey today - find opportunities, connect with talent, and grow your skills
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {!user ? (
                  <>
                    <Link to="/register" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl">
                      Get Started
                    </Link>
                    <Link to="/jobs" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                      Browse Jobs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/jobs" className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl">
                      Find Opportunities
                    </Link>
                    {user.role === 'CLIENT' && (
                      <Link to="/create-job" className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                        Post a Job
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Platforms;