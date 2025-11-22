import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import { User, Camera, Shield } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'creator' | 'client'>('client');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, selectedRole);
    
    switch (selectedRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'creator':
        navigate('/creator');
        break;
      case 'client':
        navigate('/client');
        break;
    }
  };

  const roles = [
    { value: 'client', label: 'Client', icon: User, desc: 'View and select photos from your albums' },
    { value: 'creator', label: 'Creator', icon: Camera, desc: 'Upload albums and manage photo selections' },
    { value: 'admin', label: 'Admin', icon: Shield, desc: 'Manage users and moderate content' },
  ];

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
            <div className="space-y-4 mb-8">
              <p className="font-['Inter'] font-medium text-[16px] text-neutral-100 mb-4">
                Select your role:
              </p>
              <div className="grid grid-cols-3 gap-4">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value as any)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedRole === role.value
                        ? 'border-neutral-100 bg-neutral-100/5'
                        : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                    }`}
                  >
                    <role.icon className={`w-8 h-8 mb-3 mx-auto ${
                      selectedRole === role.value ? 'text-neutral-100' : 'text-neutral-500'
                    }`} />
                    <p className={`font-['Inter'] font-medium text-[14px] mb-1 ${
                      selectedRole === role.value ? 'text-neutral-100' : 'text-neutral-400'
                    }`}>
                      {role.label}
                    </p>
                    <p className="font-['Inter'] text-[10px] text-neutral-600">
                      {role.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

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
              className="w-full py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] hover:bg-neutral-200 transition-colors"
            >
              Sign In
            </button>

            <div className="text-center mt-6">
              <p className="font-['Inter'] text-[12px] text-neutral-500">
                Demo mode: Any email/password combination works
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
