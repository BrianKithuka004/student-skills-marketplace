import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FaStar } from 'react-icons/fa';

const ReviewSection = ({ userId, jobId, onReviewSubmitted }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

 useEffect(() => {
  if (userId) {
    fetchReviews();
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [userId]);
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/reviews/user/${userId}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/reviews', { jobId, rating, comment });
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      fetchReviews();
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Reviews</h3>
      
      {/* Submit Review Form */}
      <div className="bg-gray-50/50 rounded-2xl p-6 mb-6">
        <h4 className="font-semibold mb-3">Write a Review</h4>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="text-3xl focus:outline-none transition-transform hover:scale-110"
              >
                <FaStar
                  className={`${(hover || rating) >= star ? 'text-yellow-400' : 'text-gray-300'} transition-colors`}
                />
              </button>
            ))}
            <span className="text-sm text-gray-500 ml-2">{rating > 0 ? `${rating} stars` : 'Select rating'}</span>
          </div>
          <textarea
            className="input-field h-24 mb-3"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary text-sm py-2 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
                    {review.reviewer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{review.reviewer.name}</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`${i < review.rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;