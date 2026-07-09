import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import JobChat from '../components/JobChat';
import { FaArrowLeft } from 'react-icons/fa';

const JobChatPage = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/applications/${applicationId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setApplication(data.application);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    if (applicationId) {
      fetchApplication();
    }
  }, [applicationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Loading chat...</div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white">Application not found</div>
      </div>
    );
  }

  // Determine other user info
  const isStudent = user?.role === 'STUDENT';
  const otherUser = isStudent ? application.job?.client : application.student;
  const otherUserName = otherUser?.name || 'User';
  const otherUserRole = isStudent ? 'CLIENT' : 'STUDENT';

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-80px)]">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
        >
          <FaArrowLeft size={16} />
          Back
        </button>

        <JobChat
          applicationId={applicationId}
          jobTitle={application.job?.title || 'Job'}
          otherUserName={otherUserName}
          otherUserRole={otherUserRole}
        />
      </div>
    </div>
  );
};

export default JobChatPage;