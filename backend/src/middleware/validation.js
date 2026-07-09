const validateRegistration = (req, res, next) => {
  const { name, email, password, role, university, company } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide: name, email, and password'
    });
  }

  // Only require university for STUDENTS
  if (role === 'STUDENT' && !university) {
    return res.status(400).json({
      success: false,
      message: 'University is required for students'
    });
  }

  // Only require company for CLIENTS
  if (role === 'CLIENT' && !company) {
    return res.status(400).json({
      success: false,
      message: 'Company name is required for clients'
    });
  }

  next();
};

module.exports = { validateRegistration };