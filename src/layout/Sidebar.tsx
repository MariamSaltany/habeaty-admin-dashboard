import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Add Product', path: '/product/add' },
  ];

  const handleLogout = () => {
      logout();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-brand-black text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-6">
          {/* Logo Area */}
          <div className="mb-12 flex items-center justify-between md:justify-center">
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              HA<span className="text-brand-pink">Admin</span>
            </h1>
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => { if(window.innerWidth < 768) onClose(); }}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 rounded-sm ${
                    isActive
                      ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Footer / Logout */}
          <div className="pt-8 border-t border-white/10">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-white hover:bg-red-500/10 transition-colors rounded-sm group"
            >
                <span className="group-hover:text-red-400 transition-colors">Logout</span>
            </button>
            <div className="mt-8 text-center">
                <p className="text-[9px] text-gray-600 uppercase tracking-widest">v1.0.0 • 2025</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};