const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ========== GET USER PROFILE ==========
const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = id || req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        jobs: true,
        applications: {
          include: {
            job: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// ========== UPDATE USER PROFILE ==========
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, university, course, bio } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        university,
        course,
        bio
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// ========== GET ALL USERS (for chat) ==========
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        university: true,
        rating: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
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

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers
};