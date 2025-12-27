// kotobi-admin-dashboard-web/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock, User, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ username, password });
      login(response.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100 overflow-hidden border border-indigo-50">
          <div className="p-8 pb-0 flex flex-col items-center">
            <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight text-center">Lumina Library</h1>
            <p className="text-gray-500 mt-2 text-center font-medium">Administrator Access Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-10 space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="text"
                  placeholder="admin"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-400 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  Sign In Securely
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-center text-xs text-gray-400 mt-6">
              Forgot password? Please contact IT support.
            </p>
          </form>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="text-xs text-gray-400 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            System Operational
          </div>
          <div className="text-xs text-gray-400">v2.4.0-stable</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
