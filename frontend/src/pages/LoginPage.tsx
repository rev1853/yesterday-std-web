import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'creator':
          navigate('/creator');
          break;
        case 'client':
        default:
          navigate('/client');
          break;
      }
    } catch (err) {
      setError('Invalid credentials. Try admin@/creator@/client@example.com with password "password".');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Navbar />
      
      <div className="pt-[200px] pb-[100px] px-[138px]">
        <div className="max-w-[600px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-['Inter'] font-extrabold text-[64px] text-neutral-100 tracking-[-3.2px] mb-4">
              Welcome Back
            </h1>
            <p className="font-['Inter'] text-[20px] text-neutral-400 tracking-[-1px]">
              Sign in to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-6 py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-6 py-4 bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl text-neutral-100 font-['Inter'] focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] hover:bg-neutral-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="text-center mt-6">
              {error ? (
                <p className="font-['Inter'] text-[12px] text-red-400">{error}</p>
              ) : (
                <p className="font-['Inter'] text-[12px] text-neutral-500">
                  Seeded demo accounts: admin@example.com, creator@example.com, client@example.com (password: password)
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
