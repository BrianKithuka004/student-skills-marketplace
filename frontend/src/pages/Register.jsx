import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaUniversity, FaGraduationCap, FaArrowRight, FaEye, FaEyeSlash, FaBuilding } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    course: '',
    company: '',
    role: 'STUDENT'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.role === 'CLIENT' && !formData.company) {
      setError('Please enter your company name');
      return;
    }

    setLoading(true);
    
    try {
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'STUDENT') {
        registrationData.university = formData.university || '';
        registrationData.course = formData.course || '';
      } else if (formData.role === 'CLIENT') {
        registrationData.company = formData.company || '';
      }

      await register(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 bg-[#0f0a1a] pt-20">
      <div className="max-w-md w-full glass-card rounded-3xl p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-purple-500/30">
            🎓
          </div>
          <h2 className="text-3xl font-extrabold mt-4 gradient-text">Join the Community</h2>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Role - FIXED DROPDOWN */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Register as</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 z-10" size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-[#1a1a2e] border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="STUDENT" className="bg-[#1a1a2e] text-white py-2 hover:bg-purple-500/20">🎓 Student - Offer my skills</option>
                <option value="CLIENT" className="bg-[#1a1a2e] text-white py-2 hover:bg-purple-500/20">💼 Client - Hire students</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-400">
                ▼
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {formData.role === 'STUDENT' 
                ? '🎓 You can apply to jobs and offer your skills' 
                : '💼 You can post jobs and hire students'}
            </p>
          </div>

          {/* Company - Only for CLIENT */}
          {formData.role === 'CLIENT' && (
            <div>
              <label className="block text-gray-300 font-medium mb-2">Company Name</label>
              <div className="relative">
                <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Your Company"
                />
              </div>
            </div>
          )}

          {/* University - Only for STUDENT */}
          {formData.role === 'STUDENT' && (
            <div>
              <label className="block text-gray-300 font-medium mb-2">University</label>
              <div className="relative">
                <FaUniversity className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Your University"
                />
              </div>
            </div>
          )}

          {/* Course - Only for STUDENT */}
          {formData.role === 'STUDENT' && (
            <div>
              <label className="block text-gray-300 font-medium mb-2">Course (Optional)</label>
              <div className="relative">
                <FaGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={18} />
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  placeholder="Computer Science"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                placeholder="••••••••"
                minLength="6"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${formData.confirmPassword && !passwordsMatch ? 'border-red-500/50' : 'border-white/10'}`}
                placeholder="••••••••"
                minLength="6"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <p className={`text-sm mt-1 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                {passwordsMatch ? '✅ Passwords match' : '❌ Passwords do not match'}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? 'Creating account...' : 'Create Account'}
            <FaArrowRight className="inline-block" />
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold hover:underline transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;