import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaEnvelope, FaGraduationCap, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaComment } from 'react-icons/fa';

const ManageApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const jobResponse = await api.get(`/jobs/${jobId}`);
      setJob(jobResponse.data.job);
      
      const appsResponse = await api.get(`/applications/job/${jobId}`);
      setApplications(appsResponse.data.applications);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load applications');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdating(applicationId);
      await api.put(`/applications/${applicationId}`, { status });
      toast.success(`Application ${status.toLowerCase()}!`);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(null);
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
      default: return null;
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
        <Link to="/jobs" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6">
          <FaArrowLeft /> Back to Jobs
        </Link>

        <div className="glass-card rounded-3xl p-6 mb-6">
          <h1 className="text-3xl font-extrabold gradient-text">{job?.title}</h1>
          <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
            <span className="font-semibold text-purple-600">${job?.budget}</span>
            <span>•</span>
            <span className="badge badge-primary">{job?.category}</span>
            <span>•</span>
            <span className="text-sm">{applications.length} applicant{applications.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center">
            <div className="text-6xl mb-4">👀</div>
            <p className="text-gray-500 text-lg">No applications for this job yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                        {app.student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{app.student.name}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaGraduationCap className="text-purple-500" /> {app.student.university}
                          </span>
                          {app.student.course && (
                            <>
                              <span>•</span>
                              <span>{app.student.course}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FaEnvelope className="text-purple-500" /> {app.student.email}
                      </p>
                      {app.coverLetter && (
                        <p className="text-gray-600 text-sm bg-gray-50/50 p-3 rounded-xl">
                          <span className="font-medium">📄 Cover Letter:</span> {app.coverLetter}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Chat Button - For clients to chat with student */}
                    <div className="mt-3">
                      <Link
                        to={`/chat/job/${app.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                      >
                        <FaComment size={14} />
                        Chat with {app.student.name}
                      </Link>
                    </div>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <div className={`flex items-center justify-end gap-2 px-4 py-2 rounded-xl border-2 ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      <span className="font-semibold">{app.status}</span>
                    </div>
                    {app.status === 'PENDING' && (
                      <div className="mt-2 space-y-2">
                        <button
                          onClick={() => updateStatus(app.id, 'ACCEPTED')}
                          disabled={updating === app.id}
                          className="w-full btn-success text-sm py-2 disabled:opacity-50"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, 'REJECTED')}
                          disabled={updating === app.id}
                          className="w-full btn-danger text-sm py-2 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;