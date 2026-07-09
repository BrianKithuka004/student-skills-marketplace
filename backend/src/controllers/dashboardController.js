const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ========== GET DASHBOARD STATS ==========
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let stats = {};

    if (user.role === 'STUDENT') {
      // Student stats
      const applications = await prisma.application.findMany({
        where: { studentId: userId }
      });

      const accepted = applications.filter(a => a.status === 'ACCEPTED');
      const pending = applications.filter(a => a.status === 'PENDING');
      const rejected = applications.filter(a => a.status === 'REJECTED');

      stats = {
        totalApplications: applications.length,
        accepted: accepted.length,
        pending: pending.length,
        rejected: rejected.length
      };
    } else if (user.role === 'CLIENT') {
      // Client stats
      const jobs = await prisma.job.findMany({
        where: { clientId: userId }
      });

      const openJobs = jobs.filter(j => j.status === 'OPEN');
      const inProgress = jobs.filter(j => j.status === 'IN_PROGRESS');
      const completed = jobs.filter(j => j.status === 'COMPLETED');

      // Get total applicants
      let totalApplicants = 0;
      for (const job of jobs) {
        const count = await prisma.application.count({
          where: { jobId: job.id }
        });
        totalApplicants += count;
      }

      stats = {
        totalJobs: jobs.length,
        openJobs: openJobs.length,
        inProgress: inProgress.length,
        completed: completed.length,
        totalApplicants: totalApplicants
      };
    }

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard stats',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardStats
};