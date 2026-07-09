import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    category: 'DEVELOPMENT',
    location: '',
    isRemote: false
  });

  const categories = [
    'DEVELOPMENT', 'DESIGN', 'WRITING', 'TUTORING',
    'VIDEO_EDITING', 'DATA_ANALYSIS', 'MARKETING', 'OTHER'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/jobs', formData);
      toast.success('Job posted successfully!');
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom max-w-2xl py-8">
      <h1 className="text-3xl font-extrabold text-white mb-6">Post a New Job</h1>
      
      <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-8">
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              className="input-field"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Need a React Developer"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
            <textarea
              name="description"
              required
              rows="4"
              className="input-field resize-none"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job requirements..."
            />
          </div>

          {/* Budget & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Budget ($) *</label>
              <input
                type="number"
                name="budget"
                required
                min="0"
                step="0.01"
                className="input-field"
                value={formData.budget}
                onChange={handleChange}
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                name="category"
                required
                className="input-field"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text"
              name="location"
              className="input-field"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Campus, Online"
            />
          </div>

          {/* Remote Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isRemote"
              checked={formData.isRemote}
              onChange={handleChange}
              className="w-5 h-5 accent-purple-500"
            />
            <label className="text-gray-300 text-sm">This is a remote job</label>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 min-w-[120px] text-center"
          >
            {loading ? 'Posting...' : '✅ Post Job'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/jobs')}
            className="btn-secondary flex-1 min-w-[120px] text-center"
          >
            Cancel
          </button>
          
          <button
            type="reset"
            className="bg-gray-600/50 hover:bg-gray-600/70 text-white px-6 py-3 rounded-xl font-medium transition-all border border-white/10"
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJob;