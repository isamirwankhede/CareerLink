import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, LogOut, User, LayoutDashboard, PlusCircle,
  ListChecks, Users, Home, BookmarkCheck, FileText, Menu, X, ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const isActive = (path) => location.pathname === path;
  const linkClass = (path) =>
    `flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
      isActive(path) ? 'text-primary-400' : 'text-gray-400 hover:text-white'
    }`;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userLinks = [
    { to: '/', icon: <Home size={15} />, label: 'Jobs' },
    { to: '/applied', icon: <FileText size={15} />, label: 'Applied' },
    { to: '/saved', icon: <BookmarkCheck size={15} />, label: 'Saved' },
    { to: '/profile', icon: <User size={15} />, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={15} />, label: 'Dashboard' },
    { to: '/admin/jobs', icon: <ListChecks size={15} />, label: 'Manage Jobs' },
    { to: '/admin/post-job', icon: <PlusCircle size={15} />, label: 'Post Job' },
    { to: '/admin/applicants', icon: <Users size={15} />, label: 'Applicants' },
    { to: '/admin/company', icon: <Briefcase size={15} />, label: 'Company' },
  ];

  const navLinks = user?.role === 'admin' ? adminLinks : userLinks;

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-violet-500 rounded-lg flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary-400 to-violet-400 bg-clip-text text-transparent">
              CareerLink
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated &&
              navLinks.map((link) => (
                <Link key={link.to} to={link.to} className={linkClass(link.to)}>
                  {link.icon}
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:border-primary-500/40 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{user?.name?.split(' ')[0]}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${user?.role === 'admin' ? 'bg-violet-500/20 text-violet-300' : 'bg-primary-500/20 text-primary-300'}`}>
                    {user?.role}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-48 glass-dark rounded-xl border border-white/15 shadow-glass py-2 animate-scale-in">
                    {user?.role === 'user' && (
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User size={14} /> Profile
                      </Link>
                    )}
                    <button
                      onClick={() => { setDropdownOpen(false); handleLogout(); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-2 px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 px-4 py-4 space-y-2 animate-slide-up">
          {isAuthenticated ? (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(link.to) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.icon} {link.label}
                </Link>
              ))}
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={15} /> Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary justify-center">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary justify-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
