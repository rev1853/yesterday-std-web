import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/ToastContainer';
import { UserPlus, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useApp();
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signUp(formData.name, formData.email, formData.password);
      showToast('success', 'Account created successfully!');
      navigate('/client');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Signup failed';
      showToast('error', message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 font-['Inter'] text-[14px] text-neutral-400 hover:text-neutral-100 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-['Inter'] font-extrabold text-[32px] text-neutral-100 tracking-[-1.6px] mb-2">
            Create Account
          </h1>
          <p className="font-['Inter'] text-[16px] text-neutral-400">
            Sign up as a client to access albums
          </p>
        </div>

        <div className="bg-[#1e1e1e] border-2 border-neutral-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="font-['Inter'] font-extrabold text-[20px] text-neutral-100 tracking-[-1px] flex items-center gap-2 mb-1">
              <UserPlus className="w-5 h-5" />
              Client Registration
            </h2>
            <p className="font-['Inter'] text-[14px] text-neutral-400">
              Fill in your details to create a new client account
            </p>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#0d0d0d] border-2 rounded-xl font-['Inter'] text-[14px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.name && (
                  <p className="font-['Inter'] text-[12px] text-red-400">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#0d0d0d] border-2 rounded-xl font-['Inter'] text-[14px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.email && (
                  <p className="font-['Inter'] text-[12px] text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password (min. 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#0d0d0d] border-2 rounded-xl font-['Inter'] text-[14px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.password && (
                  <p className="font-['Inter'] text-[12px] text-red-400">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block font-['Inter'] font-medium text-[14px] text-neutral-100">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#0d0d0d] border-2 rounded-xl font-['Inter'] text-[14px] text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors ${
                    errors.confirmPassword ? 'border-red-500' : 'border-neutral-800'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="font-['Inter'] text-[12px] text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-neutral-100 text-[#0d0d0d] rounded-xl font-['Inter'] font-extrabold text-[16px] tracking-[-0.8px] hover:bg-neutral-200 transition-colors"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

        <p className="font-['Inter'] text-[14px] text-neutral-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-neutral-100 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
