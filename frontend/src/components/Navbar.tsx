import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'creator':
        return '/creator';
      case 'client':
        return '/client';
      default:
        return '/';
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isDashboardActive = () => {
    const dashboardLink = getDashboardLink();
    return location.pathname === dashboardLink || 
           location.pathname.startsWith('/admin') || 
           location.pathname.startsWith('/creator') || 
           location.pathname.startsWith('/client');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-sm border-b border-neutral-900">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-16 lg:px-[138px] py-4 sm:py-6 lg:py-[41px]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="h-[48px] w-[44px] sm:h-[56px] sm:w-[50px] lg:h-[68px] lg:w-[61px] shrink-0">
            <div className="h-full w-full bg-neutral-100 rounded-lg flex items-center justify-center">
              <span className="font-['Inter'] text-[18px] sm:text-[20px] lg:text-[24px] font-black text-[#0d0d0d]">UP</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-[40px] items-center absolute left-1/2 transform -translate-x-1/2">
            <Link 
              to="/" 
              className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all ${
                isActive('/') && !user ? 'font-extrabold' : 'font-medium'
              }`}
            >
              Home
            </Link>
            {user && (
              <Link 
                to={getDashboardLink()} 
                className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all ${
                  isDashboardActive() ? 'font-extrabold' : 'font-medium'
                }`}
              >
                Dashboard
              </Link>
            )}
            <Link 
              to="/albums" 
              className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all ${
                isActive('/albums') ? 'font-extrabold' : 'font-medium'
              }`}
            >
              Albums
            </Link>
            <Link 
              to="/contact" 
              className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all ${
                isActive('/contact') ? 'font-extrabold' : 'font-medium'
              }`}
            >
              Contact Us
            </Link>
          </div>
          
          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex flex-col items-end">
                  <p className="font-['Inter'] text-[12px] text-neutral-100">{user.name}</p>
                  <p className="font-['Inter'] text-[10px] text-neutral-400 capitalize">{user.role}</p>
                </div>
                <div className="size-[65px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="font-['Inter'] font-black text-white text-[24px]">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-neutral-100" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 bg-neutral-100 text-[#0d0d0d] rounded-lg font-['Inter'] font-medium hover:bg-neutral-200 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-neutral-100" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-100" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-neutral-800">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all py-2 ${
                  isActive('/') && !user ? 'font-extrabold' : 'font-medium'
                }`}
              >
                Home
              </Link>
              {user && (
                <Link 
                  to={getDashboardLink()} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all py-2 ${
                    isDashboardActive() ? 'font-extrabold' : 'font-medium'
                  }`}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                to="/albums" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all py-2 ${
                  isActive('/albums') ? 'font-extrabold' : 'font-medium'
                }`}
              >
                Albums
              </Link>
              <Link 
                to="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className={`font-['Inter'] text-[16px] text-neutral-100 tracking-[-0.8px] transition-all py-2 ${
                  isActive('/contact') ? 'font-extrabold' : 'font-medium'
                }`}
              >
                Contact Us
              </Link>

              {/* Mobile User Section */}
              <div className="pt-4 border-t border-neutral-800 mt-2">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-[48px] rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="font-['Inter'] font-black text-white text-[18px]">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-['Inter'] text-[14px] text-neutral-100">{user.name}</p>
                        <p className="font-['Inter'] text-[12px] text-neutral-400 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-neutral-800 text-neutral-100 rounded-lg font-['Inter'] font-medium hover:bg-neutral-700 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 bg-neutral-100 text-[#0d0d0d] text-center rounded-lg font-['Inter'] font-medium hover:bg-neutral-200 transition-colors"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
