import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaSearch, FaMapMarkerAlt, FaClock, FaBriefcase, FaFilter, FaTimes, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Sample job data (fallback if API fails)
const sampleJobs = [
  {
    id: 1,
    title: 'React Developer',
    description: 'Build responsive web applications using React.js and modern JavaScript.',
    budget: 500,
    category: 'Development',
    location: 'Remote',
    client: { name: 'TechCorp' },
    createdAt: new Date().toISOString(),
    status: 'OPEN'
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    description: 'Design beautiful user interfaces and improve user experience for our products.',
    budget: 400,
    category: 'Design',
    location: 'Hybrid',
    client: { name: 'DesignStudio' },
    createdAt: new Date().toISOString(),
    status: 'OPEN'
  },
  {
    id: 3,
    title: 'Content Writer',
    description: 'Create engaging content for blogs, social media, and marketing materials.',
    budget: 300,
    category: 'Writing',
    location: 'Remote',
    client: { name: 'MediaHub' },
    createdAt: new Date().toISOString(),
    status: 'OPEN'
  },
  {
    id: 4,
    title: 'Video Editor',
    description: 'Edit and produce high-quality video content for various projects.',
    budget: 450,
    category: 'Video Editing',
    location: 'On-site',
    client: { name: 'CreativeWorks' },
    createdAt: new Date().toISOString(),
    status: 'OPEN'
  },
  {
    id: 5,
    title: 'Data Analyst',
    description: 'Analyze data and provide insights to help drive business decisions.',
    budget: 600,
    category: 'Data Analysis',
    location: 'Remote',
    client: { name: 'DataCorp' },
    createdAt: new Date().toISOString(),
    status: 'OPEN'
  },
  {
    id: 6,
    title: 'Mathematics Tutor',
    description: 'Help students understand complex mathematical concepts and improve their grades.',
    budget: 250,
    category: 'Tutoring',
    location: 'Hybrid',
    client: { name: 'EduTutors' },
    createdAt: new Date().toISOString(),
    status: 'OPEN'
  }
];

const Jobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  
  const [jobs, setJobs] = useState(sampleJobs);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '');
  const [showFilters, setShowFilters] = useState(false);
  const [applying, setApplying] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await api.get('/jobs');
        if (response.data?.jobs && response.data.jobs.length > 0) {
          setJobs(response.data.jobs);
        }
      } catch (error) {
        console.log('Using sample job data');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();

    // Fetch user's applications if logged in
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my');
      if (response.data?.applications) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.log('No applications found');
    }
  };

  const handleApply = async (jobId) => {
    // Check if user is logged in
    if (!user) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    // Check if user is a student
    if (user.role !== 'STUDENT') {
      toast.error('Only students can apply for jobs');
      return;
    }

    // Check if already applied
    if (applications.some(app => app.jobId === jobId)) {
      toast.error('You have already applied for this job');
      return;
    }

    try {
      setApplying(jobId);
      const response = await api.post(`/applications`, { 
        jobId,
        coverLetter: 'I am interested in this position and would love to contribute to your project.'
      });
      
      if (response.data.success) {
        toast.success('Application submitted successfully!');
        // Update applications list
        setApplications([...applications, { jobId }]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'IN_PROGRESS': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'CLOSED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(jobs.map(job => job.category))];

  const hasApplied = (jobId) => {
    return applications.some(app => app.jobId === jobId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0a1a] pt-20">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold gradient-text">Find Your Next Gig</h1>
          <p className="text-gray-400 mt-2">Browse available jobs and opportunities</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary px-6 py-3 flex items-center gap-2 sm:hidden"
          >
            <FaFilter /> Filters
          </button>
        </div>

        {/* Category Filters */}
        <div className={`${showFilters ? 'flex' : 'hidden'} sm:flex flex-wrap gap-2 mb-6`}>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !selectedCategory
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-400 text-sm mb-4">
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
        </p>

        {/* Job Cards */}
        {filteredJobs.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/5">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white">No jobs found</h3>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              const applied = hasApplied(job.id);
              return (
                <div
                  key={job.id}
                  className="glass-card rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link to={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-bold text-white hover:text-purple-400 transition-colors">
                          {job.title}
                        </h3>
                      </Link>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-4">
                    <span className="text-purple-400 font-bold">
                      ${job.budget}
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                      <FaBriefcase className="text-purple-400" size={12} />
                      {job.category}
                    </span>
                    {job.location && (
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <FaMapMarkerAlt className="text-purple-400" size={12} />
                        {job.location}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-gray-400 text-sm flex items-center gap-2">
                      <FaClock className="text-purple-400" size={12} />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-sm bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-1.5 rounded-full transition-all"
                      >
                        View Details
                      </Link>
                      {job.status === 'OPEN' && user?.role === 'STUDENT' && (
                        <button
                          onClick={() => handleApply(job.id)}
                          disabled={applying === job.id || applied}
                          className={`text-sm px-4 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                            applied
                              ? 'bg-green-500/20 text-green-400 cursor-default'
                              : 'bg-purple-500 hover:bg-purple-600 text-white'
                          }`}
                        >
                          {applying === job.id ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : applied ? (
                            <><FaCheckCircle size={12} /> Applied</>
                          ) : (
                            'Apply'
                          )}
                        </button>
                      )}
                      {job.status === 'OPEN' && user?.role === 'CLIENT' && (
                        <span className="text-xs text-gray-400 self-center">
                          Posted by you
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        {user?.role === 'CLIENT' && (
          <div className="mt-8 glass-card rounded-2xl p-8 text-center border border-purple-500/10">
            <h3 className="text-xl font-bold text-white">Need to hire someone?</h3>
            <p className="text-gray-400 mt-2">Post a job and connect with talented students</p>
            <Link to="/create-job" className="btn-primary mt-4 inline-block">
              Post a Job
            </Link>
          </div>
        )}

        {!user && (
          <div className="mt-8 glass-card rounded-2xl p-8 text-center border border-purple-500/10">
            <h3 className="text-xl font-bold text-white">Want to apply for jobs?</h3>
            <p className="text-gray-400 mt-2">Login or create an account to start applying</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Link to="/login" className="btn-primary inline-block">
                Login
              </Link>
              <Link to="/register" className="btn-secondary inline-block">
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;