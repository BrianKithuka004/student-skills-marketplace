import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaComment } from 'react-icons/fa';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/applications/my');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ACCEPTED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'PENDING': return <FaHourglassHalf className="text-yellow-500" />;
      case 'ACCEPTED': return <FaCheckCircle className="text-green-500" />;
      case 'REJECTED': return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-4xl font-extrabold gradient-text mb-8">My Applications</h1>

        {applications.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">You haven't applied to any jobs yet.</p>
            <Link to="/jobs" className="text-purple-600 hover:underline mt-4 inline-block font-semibold">
              Browse Jobs →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <Link to={`/jobs/${app.job.id}`} className="hover:text-purple-600 transition-colors">
                      <h2 className="text-xl font-bold">{app.job.title}</h2>
                    </Link>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>Posted by {app.job.client.name}</span>
                      <span>•</span>
                      <span>{app.job.client.university}</span>
                      <span>•</span>
                      <span className="font-semibold text-purple-600">${app.job.budget}</span>
                      <span>•</span>
                      <span className="badge badge-primary">{app.job.category}</span>
                    </div>
                    {app.coverLetter && (
                      <p className="text-gray-600 text-sm mt-3 bg-gray-50/50 p-3 rounded-xl">
                        <span className="font-medium">📄 Cover Letter:</span> {app.coverLetter}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-3">
                      Applied on {new Date(app.createdAt).toLocaleDateString()} at {new Date(app.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="font-semibold">{app.status}</span>
                  </div>
                </div>

                {/* Chat Button - Always visible for students to chat with client */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                  <Link
                    to={`/chat/job/${app.id}`}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm font-medium"
                  >
                    <FaComment size={14} />
                    Chat with {app.job.client.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;