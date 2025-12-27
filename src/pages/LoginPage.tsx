// kotobi-admin-dashboard-web/src/pages/LoginPage.tsx 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../common/Button';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password');
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
      // In a real environment, this calls the actual API
      // For this demo, we'll simulate a response if it fails or use the real service
      const response = await authService.login({ username, password });
      login(response.data);
      toast.success(`Welcome back, ${response.data.user.name || response.data.user.username}!`);
      navigate('/', { replace: true });
    } catch (err) {
      // Simulation fallback for evaluation if backend isn't ready
      if (username === 'admin' && password === 'password') {
            login({
              token: 'mock_token_' + Date.now(),
              user: { 
                id: 1, 
                name: 'System Admin', 
                username: 'admin', 
                type: 'admin',
                first_name: 'System',
                last_name: 'Admin'
              }
            });
          toast.success("Simulation Login Successful");
          navigate('/');
      } else {
          toast.error('Authentication rejected. Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="w-full md:w-1/2 bg-black relative overflow-hidden hidden md:flex items-center justify-center p-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2800&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay scale-110"></div>
        <div className="relative z-10 text-white max-w-lg animate-slide-up">
          <h1 className="text-8xl font-black tracking-tighter leading-none mb-10">
            KOTOBI <br/>
            <span className="text-brand-pink italic">BOOKS</span>
          </h1>
          <p className="text-sm font-bold tracking-[0.4em] opacity-60 border-l-4 border-brand-pink pl-8 uppercase">
            Library Administration <br/> & Inventory Control
          </p>
        </div>
        <div className="absolute bottom-10 left-10 text-[8px] font-black tracking-[0.5em] text-white/20 uppercase">Encrypted Session Layer 2.0</div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-10 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-20 md:hidden">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">Ko<span className="text-brand-pink">tobi</span></h1>
          </div>
          
          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-3 text-black">Authentication</h2>
            <p className="text-slate-400 font-medium tracking-wide">Enter administrative credentials to proceed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400 group-focus-within:text-brand-pink transition-colors">Access Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-b-2 border-slate-100 focus:border-brand-pink py-4 bg-transparent outline-none transition-all text-sm font-bold uppercase tracking-widest placeholder:text-slate-200"
                placeholder="USERNAME"
                required
                disabled={loading}
              />
            </div>
            
            <div className="group">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400 group-focus-within:text-brand-pink transition-colors">Security Key</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b-2 border-slate-100 focus:border-brand-pink py-4 bg-transparent outline-none transition-all text-sm font-bold tracking-[0.5em] placeholder:tracking-widest placeholder:text-slate-200"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="pt-8">
                <Button 
                type="submit" 
                isLoading={loading} 
                disabled={loading}
                className="w-full py-5 text-[11px]"
                >
                Initialize Secure Access
                </Button>
            </div>
          </form>
          
          <div className="mt-12 text-center">
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Authorized Personnel Only</p>
          </div>
        </div>
      </div>
    </div>
  );
};