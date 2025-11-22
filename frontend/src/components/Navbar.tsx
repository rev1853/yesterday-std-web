import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut } from 'lucide-react';
import imgAltUrpicturaLogo1 from "../imports/Dasboard";

export default function Navbar() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/90 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-[138px] py-[41px]">
        <div className="flex items-end justify-between">
          <div className="flex gap-[40px] items-center">
            <Link to="/" className="h-[68px] w-[61px] shrink-0">
              <div className="h-[68px] w-[61px] bg-neutral-100 rounded-lg flex items-center justify-center">
                <span className="font-['Inter'] text-[24px] font-black text-[#0d0d0d]">UP</span>
              </div>
            </Link>
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
          
          <div className="flex items-center gap-4">
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
        </div>
      </div>
    </div>
  );
}