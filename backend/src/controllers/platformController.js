const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ========== GET PLATFORM STATS ==========
const getPlatformStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalApplications, totalReviews, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.review.count(),
      prisma.message.count()
    ]);

    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        client: {
          select: {
            name: true,
            university: true
          }
        }
      }
    });

    const topStudents = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      orderBy: { rating: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        university: true,
        rating: true,
        totalReviews: true,
        _count: {
          select: { applications: true }
        }
      }
    });

    const topClients = await prisma.user.findMany({
      where: { role: 'CLIENT' },
      orderBy: { rating: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        university: true,
        rating: true,
        totalReviews: true,
        _count: {
          select: { jobs: true }
        }
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        totalReviews,
        totalMessages
      },
      recentJobs,
      topStudents,
      topClients
    });

  } catch (error) {
    console.error('Platform stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get platform stats',
      error: error.message
    });
  }
};

module.exports = {
  getPlatformStats
};