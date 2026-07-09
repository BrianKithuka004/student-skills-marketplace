import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaEnvelope, FaUniversity, FaGraduationCap, FaStar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import ReviewSection from '../components/ReviewSection';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${user?.id}`);
      setProfile(response.data.user);
      setEditData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put('/users/me', editData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      fetchProfile();
      if (updateUser) updateUser(editData);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
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
        <div className="glass-card rounded-3xl p-8">
          {/* Profile Header */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl text-white font-bold">
              {profile?.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{profile?.name}</h1>
              <p className="text-gray-500">{profile?.university}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="badge badge-primary">{profile?.role}</span>
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-semibold">{profile?.rating?.toFixed(1) || '0'}</span>
                  <span className="text-gray-500 text-sm">({profile?.totalReviews || 0} reviews)</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary flex items-center gap-2"
            >
              {isEditing ? <FaTimes /> : <FaEdit />}
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <FaEnvelope className="text-purple-500" />
                <span>{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <FaUniversity className="text-purple-500" />
                <span>{profile?.university}</span>
              </div>
              {profile?.course && (
                <div className="flex items-center gap-3 text-gray-600">
                  <FaGraduationCap className="text-purple-500" />
                  <span>{profile?.course}</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Bio</h3>
              <p className="text-gray-600">{profile?.bio || 'No bio yet'}</p>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editData?.name || ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">University</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editData?.university || ''}
                    onChange={(e) => setEditData({ ...editData, university: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Course</label>
                  <input
                    type="text"
                    className="input-field"
                    value={editData?.course || ''}
                    onChange={(e) => setEditData({ ...editData, course: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea
                    className="input-field h-24"
                    value={editData?.bio || ''}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  />
                </div>
                <button onClick={handleUpdate} className="btn-primary flex items-center gap-2">
                  <FaSave /> Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <ReviewSection userId={user?.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;