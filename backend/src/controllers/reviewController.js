const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ========== CREATE REVIEW ==========
const createReview = async (req, res) => {
  try {
    const { jobId, rating, comment } = req.body;
    const reviewerId = req.userId;

    // Check if job exists and is completed
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Job must be completed to leave a review'
      });
    }

    // Check if reviewer is the client or the student
    if (job.clientId !== reviewerId && job.hiredStudent !== reviewerId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to review this job'
      });
    }

    // Determine reviewee (the other party)
    const revieweeId = job.clientId === reviewerId ? job.hiredStudent : job.clientId;

    // Create review
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        jobId,
        reviewerId,
        revieweeId
      }
    });

    // Update user rating
    const userReviews = await prisma.review.aggregate({
      where: { revieweeId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.user.update({
      where: { id: revieweeId },
      data: {
        rating: userReviews._avg.rating || 0,
        totalReviews: userReviews._count.rating || 0
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// ========== GET REVIEWS FOR USER ==========
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            university: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      reviews
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get reviews',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  getUserReviews
};