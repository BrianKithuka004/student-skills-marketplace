const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createJob = async (req, res) => {
  try {
    const { title, description, budget, category, location, isRemote } = req.body;
    const clientId = req.userId;

    if (!title || !description || !budget || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide: title, description, budget, and category'
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        budget: parseFloat(budget),
        category,
        location,
        isRemote: isRemote || false,
        clientId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Job created successfully!',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create job',
      error: error.message
    });
  }
};

const getJobs = async (req, res) => {
  try {
    const { search, category, minBudget, maxBudget } = req.query;

    const where = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    if (category) where.category = category;
    
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget.gte = parseFloat(minBudget);
      if (maxBudget) where.budget.lte = parseFloat(maxBudget);
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            university: true,
            rating: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      jobs
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            university: true,
            rating: true
          }
        },
        applications: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                university: true,
                course: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      job
    });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

const completeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const job = await prisma.job.findUnique({
      where: { id }
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
        message: 'Not authorized to complete this job'
      });
    }

    if (job.status !== 'IN_PROGRESS') {
      return res.status(400).json({
        success: false,
        message: 'Job must be in progress to complete'
      });
    }

    const updated = await prisma.job.update({
      where: { id },
      data: { status: 'COMPLETED' }
    });

    res.json({
      success: true,
      message: 'Job completed successfully!',
      job: updated
    });

  } catch (error) {
    console.error('Complete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete job',
      error: error.message
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  completeJob
};