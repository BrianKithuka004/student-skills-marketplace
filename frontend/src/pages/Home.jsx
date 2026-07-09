import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const categories = [
    { name: 'Development', icon: 'fa-code', color: 'from-blue-500 to-cyan-500', path: 'Development' },
    { name: 'Design', icon: 'fa-paintbrush', color: 'from-purple-500 to-pink-500', path: 'Design' },
    { name: 'Writing', icon: 'fa-pen-fancy', color: 'from-green-500 to-emerald-500', path: 'Writing' },
    { name: 'Video Editing', icon: 'fa-video', color: 'from-red-500 to-orange-500', path: 'Video%20Editing' },
    { name: 'Data Analysis', icon: 'fa-chart-line', color: 'from-indigo-500 to-blue-500', path: 'Data%20Analysis' },
    { name: 'Tutoring', icon: 'fa-graduation-cap', color: 'from-yellow-500 to-amber-500', path: 'Tutoring' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0a1a]">
      {/* HERO SECTION */}
      <section className="container mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-6 border border-purple-500/20">
              <i className="fa-solid fa-bullseye"></i> SkillSeek
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4">
              Find <span className="gradient-text">Student Talent</span>.<br />
              <span className="gradient-text">Get Hired</span> on Campus.
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mt-4 mb-8 max-w-lg">
              Connect with skilled students or find freelance opportunities within your university community
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/jobs" className="btn-primary px-6 sm:px-8 py-3 text-base sm:text-lg">
                Browse Jobs <i className="fa-solid fa-arrow-right ml-2"></i>
              </Link>
              {user ? (
                <Link to="/dashboard" className="btn-secondary px-6 sm:px-8 py-3 text-base sm:text-lg">
                  Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn-secondary px-6 sm:px-8 py-3 text-base sm:text-lg">
                  Join Now
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-8 sm:gap-12">
              <div><p className="text-2xl sm:text-3xl font-extrabold gradient-text">500+</p><p className="text-gray-400 text-sm mt-1">Active Jobs</p></div>
              <div><p className="text-2xl sm:text-3xl font-extrabold gradient-text">200+</p><p className="text-gray-400 text-sm mt-1">Students</p></div>
              <div><p className="text-2xl sm:text-3xl font-extrabold gradient-text">50+</p><p className="text-gray-400 text-sm mt-1">Universities</p></div>
              <div><p className="text-2xl sm:text-3xl font-extrabold gradient-text">4.8</p><p className="text-gray-400 text-sm mt-1">Average Rating</p></div>
            </div>
          </div>

          {/* Right Content - Featured Job Card */}
          <div className="relative group mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl animate-pulse"></div>

            <div className="relative bg-white/5 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-2xl opacity-30 blur-sm group-hover:opacity-50 transition-opacity"></div>

              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-purple-500/30">
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl text-white">Featured Job</h3>
                    <p className="text-gray-400 text-base sm:text-lg">React Developer</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="font-semibold text-gray-300 text-sm">Budget</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">$500</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-300 text-sm">Category</p>
                      <p className="text-gray-400 text-base sm:text-lg">Development</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-4 rounded-xl border border-purple-500/20">
                    <p className="text-sm text-purple-300 flex items-center gap-2">
                      <i className="fa-solid fa-rocket"></i> New Opportunity
                    </p>
                    <p className="font-bold text-white text-base sm:text-lg">5+ students already applied</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-semibold mb-4 border border-purple-500/20">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold">
              Browse by <span className="gradient-text">Category</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/jobs?category=${category.path}`}
                className={`bg-gradient-to-br ${category.color} p-6 sm:p-8 rounded-2xl text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 opacity-90 hover:opacity-100 text-center border border-white/5 hover:border-white/20`}
              >
                <i className={`fa-solid ${category.icon} text-3xl sm:text-4xl mb-3 sm:mb-4`}></i>
                <p className="font-semibold text-sm sm:text-base">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-10 sm:p-12 lg:p-16 text-center shadow-2xl border border-white/10">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 sm:mb-6">Ready to Get Started?</h2>
              <p className="text-white/80 text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join thousands of students already connecting and collaborating on campus
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {user ? (
                  <Link to="/dashboard" className="btn-primary px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl">
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/register" className="btn-primary px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl">
                    Create Account
                  </Link>
                )}
                <Link to="/jobs" className="bg-white/20 backdrop-blur-sm text-white px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg rounded-xl font-bold border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;