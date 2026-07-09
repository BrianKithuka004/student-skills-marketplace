import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaArrowLeft, FaMapMarkerAlt, FaGlobe, FaClock, FaUser, FaBuilding } from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/jobs/${id}`);
      setJob(response.data.job);
      
      if (user) {
        try {
          const appsResponse = await api.get('/applications/my');
          const applied = appsResponse.data.applications.some(
            app => app.jobId === id
          );
          setHasApplied(applied);
        } catch (error) {
          console.log('Not logged in or no applications');
        }
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (user.role !== 'STUDENT') {
      toast.error('Only students can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      await api.post('/applications', { jobId: id, coverLetter });
      toast.success('Application submitted successfully!');
      setShowApplyModal(false);
      setHasApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!job) {
    return <div className="container-custom py-8">Job not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container-custom max-w-4xl">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6">
          <FaArrowLeft /> Back to Jobs
        </Link>

        <div className="glass-card rounded-3xl p-8">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-extrabold gradient-text">{job.title}</h1>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className="badge badge-primary">{job.category}</span>
                <span className={`badge ${job.status === 'OPEN' ? 'badge-success' : 'badge-warning'}`}>
                  {job.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-extrabold text-purple-600">${job.budget}</p>
              <p className="text-gray-500 text-sm">Budget</p>
            </div>
          </div>

          {/* Job Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50/50 rounded-2xl mb-6">
            <div className="flex items-center gap-3">
              <FaUser className="text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Posted by</p>
                <p className="font-semibold">{job.client.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaBuilding className="text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">University</p>
                <p className="font-semibold">{job.client.university}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {job.isRemote ? <FaGlobe className="text-purple-500" /> : <FaMapMarkerAlt className="text-purple-500" />}
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-semibold">{job.isRemote ? '🌐 Remote' : job.location || 'On-site'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Posted</p>
                <p className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>

          {/* Apply Button */}
          {job.status === 'OPEN' && user?.role === 'STUDENT' && !hasApplied && (
            <div className="border-t border-gray-200 pt-6">
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-primary w-full text-center"
              >
                Apply for this Job
              </button>
            </div>
          )}

          {hasApplied && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-2xl text-center font-semibold">
                ✅ You have already applied to this job
              </div>
            </div>
          )}

          {job.status !== 'OPEN' && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-gray-50 border-2 border-gray-200 text-gray-700 p-4 rounded-2xl text-center font-semibold">
                This job is no longer accepting applications
              </div>
            </div>
          )}
        </div>

        {/* Apply Modal */}
        {showApplyModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold gradient-text mb-4">Apply for this Job</h2>
              <p className="text-gray-600 mb-4">Application for: <span className="font-semibold">{job.title}</span></p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Cover Letter</label>
                <textarea
                  className="input-field h-32"
                  placeholder="Why are you a good fit for this job?"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex-1 btn-primary text-center disabled:opacity-50"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="flex-1 btn-secondary text-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;