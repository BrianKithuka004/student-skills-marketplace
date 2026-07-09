import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, FaComments, FaUser, FaBriefcase, FaSignOutAlt, 
  FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaChevronDown,
  FaGraduationCap, FaBuilding, FaCog, FaChartBar
} from 'react-icons/fa';

const NAV_LINKS = {
  public: [
    { to: '/', label: 'Home', icon: FaHome },
    { to: '/jobs', label: 'Jobs', icon: FaBriefcase },
    { to: '/dashboard', label: 'Dashboard', icon: FaChartBar },
  ],
  student: [
    { to: '/my-applications', label: 'My Applications', icon: FaGraduationCap },
  ],
  client: [
    { to: '/create-job', label: 'Post a Job', icon: FaBuilding },
  ],
  admin: [
    { to: '/admin', label: 'Admin Panel', icon: FaCog },
  ],
};

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    closeAllMenus();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(prev => !prev);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const getRoleLinks = () => {
    const roleMap = {
      STUDENT: NAV_LINKS.student,
      CLIENT: NAV_LINKS.client,
      ADMIN: NAV_LINKS.admin,
    };
    return roleMap[user?.role] || [];
  };

  const renderNavLink = ({ to, label, icon: Icon }, isMobile = false) => (
    <Link
      key={to}
      to={to}
      className={`${
        isMobile 
          ? 'text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-3 py-2'
          : 'text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-1'
      }`}
      onClick={closeAllMenus}
    >
      <Icon className="text-sm" />
      {label}
    </Link>
  );

  const renderUserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
      {user?.name?.charAt(0) || 'U'}
    </div>
  );

  const renderDesktopUserMenu = () => (
    <div className="relative">
      <button
        onClick={toggleUserMenu}
        className="flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors focus:outline-none"
      >
        {renderUserAvatar()}
        <span className="hidden lg:inline">{user?.name?.split(' ')[0]}</span>
        <FaChevronDown className={`text-xs transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50">
          <Link 
            to="/profile" 
            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            onClick={closeAllMenus}
          >
            <FaUser className="text-sm" />
            <span>Profile</span>
          </Link>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
            onClick={closeAllMenus}
          >
            <FaChartBar className="text-sm" />
            <span>Dashboard</span>
          </Link>
          <div className="border-t border-white/5 my-1"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors w-full text-left"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  const renderDesktopAuthButtons = () => (
    <>
      <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-1">
        <FaSignInAlt className="text-sm" />
        Login
      </Link>
      <Link to="/register" className="btn-primary py-2 px-5 text-sm flex items-center gap-1">
        <FaUserPlus className="text-sm" />
        Get Started
      </Link>
    </>
  );

  const renderMobileUserSection = () => {
    if (!user) {
      return (
        <>
          <Link 
            to="/login" 
            className="text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-3 py-2"
            onClick={closeAllMenus}
          >
            <FaSignInAlt className="text-sm w-5" />
            Login
          </Link>
          <Link 
            to="/register" 
            className="btn-primary text-center py-2.5"
            onClick={closeAllMenus}
          >
            Get Started
          </Link>
        </>
      );
    }

    return (
      <>
        <div className="flex items-center gap-3 py-2 text-gray-300">
          {renderUserAvatar()}
          <span className="font-medium">{user.name}</span>
        </div>
        <Link 
          to="/profile" 
          className="text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-3 py-2"
          onClick={closeAllMenus}
        >
          <FaUser className="text-sm w-5" />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 font-medium transition-colors flex items-center gap-3 py-2 w-full text-left"
        >
          <FaSignOutAlt className="text-sm w-5" />
          Logout
        </button>
      </>
    );
  };

  const getAllMobileLinks = () => {
    const links = [
      ...NAV_LINKS.public,
      ...getRoleLinks(),
    ];
    
    if (user) {
      links.push({ to: '/chat', label: 'Messages', icon: FaComments });
    }
    
    return links;
  };

  return (
    <header className="navbar-glass fixed top-0 w-full z-50">
      <div className="container-custom py-3 flex justify-between items-center">
        
        <Link 
          to="/" 
          className="text-2xl font-extrabold gradient-text flex items-center gap-2" 
          onClick={closeAllMenus}
        >
          <span className="text-3xl">🎯</span>
          SkillSeek
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.public.map(link => renderNavLink(link))}
          {getRoleLinks().map(link => renderNavLink(link))}
          {user && (
            <Link 
              to="/chat" 
              className="text-gray-300 hover:text-white font-medium transition-colors flex items-center gap-1"
              onClick={closeAllMenus}
            >
              <FaComments className="text-sm" />
              Messages
            </Link>
          )}
          {user ? renderDesktopUserMenu() : renderDesktopAuthButtons()}
        </nav>

        <button 
          onClick={toggleMobileMenu}
          className="md:hidden text-gray-300 hover:text-white transition-colors text-2xl"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-white/5 py-4 px-4">
          <div className="flex flex-col space-y-3">
            {getAllMobileLinks().map(link => renderNavLink(link, true))}
            <div className="border-t border-white/5 my-2"></div>
            {renderMobileUserSection()}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;