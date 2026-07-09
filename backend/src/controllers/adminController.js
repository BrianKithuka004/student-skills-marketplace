const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ========== GET DASHBOARD STATS ==========
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, totalReviews] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.review.count()
    ]);

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            name: true
          }
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalReviews
      },
      recentUsers,
      recentJobs
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get stats',
      error: error.message
    });
  }
};

// ========== GET ALL USERS ==========
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        university: true,
        rating: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            jobs: true,
            applications: true
          }
        }
      }
    });

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// ========== UPDATE USER ==========
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        isVerified,
        role
      }
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// ========== DELETE USER ==========
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// ========== DELETE JOB ==========
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.job.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUser,
  deleteUser,
  deleteJob
};