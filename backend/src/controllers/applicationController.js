const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const studentId = req.userId;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    const existing = await prisma.application.findUnique({
      where: {
        studentId_jobId: {
          studentId,
          jobId
        }
      }
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this job'
      });
    }

    const application = await prisma.application.create({
      data: {
        studentId,
        jobId,
        coverLetter
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            university: true,
            course: true
          }
        },
        job: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application
    });

  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply for job',
      error: error.message
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await prisma.application.findMany({
      where: { studentId: req.userId },
      include: {
        job: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
                university: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.userId;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.clientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const applications = await prisma.application.findMany({
      where: { jobId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            course: true,
            rating: true,
            bio: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.userId;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: true,
        student: true
      }
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.job.clientId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (status === 'ACCEPTED' && application.job.hiredStudent) {
      return res.status(400).json({
        success: false,
        message: 'This job already has a hired student'
      });
    }

    if (status === 'ACCEPTED' && application.job.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: true
      }
    });

    if (status === 'ACCEPTED') {
      await prisma.job.update({
        where: { id: application.jobId },
        data: { 
          status: 'IN_PROGRESS',
          hiredStudent: application.studentId
        }
      });

      await prisma.application.updateMany({
        where: {
          jobId: application.jobId,
          id: { not: id },
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });
    }

    res.json({
      success: true,
      message: 'Application updated successfully!',
      application: updated
    });

  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application',
      error: error.message
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
};