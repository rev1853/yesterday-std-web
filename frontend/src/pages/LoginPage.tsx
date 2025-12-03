import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const loggedIn = await login(email, password);
      const role = loggedIn.role;

      const pendingInvite = sessionStorage.getItem('pendingInvite');
      if (pendingInvite && role === 'client') {
        sessionStorage.removeItem('pendingInvite');
        navigate(`/invitation/${pendingInvite}`);
        return;
      }

      if (role === 'admin') navigate('/admin');
      else if (role === 'creator') navigate('/creator');
      else navigate('/client');
    } catch (err) {
      setError('Invalid credentials. Try admin@/creator@/client@example.com with password "password".');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[120px] sm:pt-[150px] md:pt-[180px] lg:pt-[200px] pb-[60px] sm:pb-[80px] lg:pb-[100px] px-4 sm:px-8 md:px-16 lg:px-[138px]">
        <div className="max-w-[90%] sm:max-w-[500px] md:max-w-[600px] mx-auto">
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h1 className="font-['Inter'] font-extrabold text-[32px] sm:text-[48px] md:text-[56px] lg:text-[64px] text-neutral-100 tracking-[-1.6px] sm:tracking-[-2.4px] md:tracking-[-2.8px] lg:tracking-[-3.2px] mb-3 sm:mb-4">
              Welcome Back
            </h1>
            <p className="font-['Inter'] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-neutral-400 tracking-[-0.7px] sm:tracking-[-0.8px] md:tracking-[-0.9px] lg:tracking-[-1px]">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block font-['Inter'] font-medium text-[13px] sm:text-[14px] text-neutral-100 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] text-[14px] sm:text-[15px] lg:text-[16px] focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-['Inter'] font-medium text-[13px] sm:text-[14px] text-neutral-100 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 sm:px-5 lg:px-6 py-3 sm:py-3.5 lg:py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] text-[14px] sm:text-[15px] lg:text-[16px] focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 sm:py-3.5 lg:py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[14px] sm:text-[15px] lg:text-[16px] tracking-[-0.7px] sm:tracking-[-0.75px] lg:tracking-[-0.8px] hover:bg-neutral-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center mt-5 sm:mt-6 space-y-2">
              {error ? (
                <p className="font-['Inter'] text-[12px] text-red-400">{error}</p>
              ) : (
                <p className="font-['Inter'] text-[12px] text-neutral-500">
                  Seeded demo accounts: admin@example.com, creator@example.com, client@example.com (password: password)
                </p>
              )}
              <p className="font-['Inter'] text-[13px] sm:text-[14px] text-neutral-400">
                Don't have an account?{' '}
                <Link to="/signup" className="text-neutral-100 hover:underline">
                  Sign up as a client
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
