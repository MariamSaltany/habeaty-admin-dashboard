import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../common/Button';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass'); 
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;

    setLoading(true);

    try {
      const data = await loginUser(username, password);
      login(data);
      toast.success(`Welcome back, ${data.firstName}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Optional: Return null while redirecting to avoid brief flash of form
  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Side */}
      <div className="w-full md:w-1/2 bg-brand-black relative overflow-hidden hidden md:flex items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2787&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay hover:scale-105 transition-transform duration-[20s]"></div>
        <div className="relative z-10 text-white max-w-lg animate-slide-up">
          <h1 className="text-6xl font-black tracking-tighter mb-6">
            MODERN <br/>
            <span className="text-brand-pink">BEAUTY</span>
          </h1>
          <p className="text-lg font-light tracking-widest opacity-90 border-l-2 border-brand-pink pl-6">
            ADMINISTRATION DASHBOARD
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-12 md:hidden">
            <h1 className="text-4xl font-black tracking-tighter uppercase">HA<span className="text-brand-pink">Beauty</span></h1>
          </div>
          
          <h2 className="text-2xl font-bold uppercase tracking-widest mb-2 text-brand-black">Welcome Back</h2>
          <p className="text-gray-500 mb-10 font-light">Please enter your details to sign in.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-gray-500">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-brand-pink py-2 bg-transparent outline-none transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="ENTER USERNAME"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-gray-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-gray-300 focus:border-brand-pink py-2 bg-transparent outline-none transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="ENTER PASSWORD"
                required
                disabled={loading}
              />
            </div>

            <Button 
              type="submit" 
              isLoading={loading} 
              disabled={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-400">Use 'emilys' / 'emilyspass' for demo</p>
          </div>
        </div>
      </div>
    </div>
  );
};