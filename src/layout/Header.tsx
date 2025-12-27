import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 h-20 px-6 md:px-10 flex items-center justify-between border-b border-gray-100 transition-all">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 text-brand-black hover:text-brand-pink transition-colors focus:outline-none"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
        
        {/* Breadcrumb / Page Title Placeholder */}
        <div className="hidden md:block">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Administration</span>
        </div>
      </div>
      
      {/* Right: User Profile */}
      <div className="flex items-center gap-6">
          {user && (
           <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
             <div className="text-right">
               <p className="text-xs font-bold uppercase tracking-wider text-brand-black">{user.first_name || user.name} {user.last_name || ''}</p>
               <p className="text-[9px] font-bold text-brand-pink tracking-widest uppercase">Admin</p>
             </div>
             <div className="relative">
              <img 
                src={(user as any).photo?.data || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name || user.name || user.username)}&background=f1f5f9&color=64748b&size=128&bold=true`} 
                  alt="User" 
                  className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm object-cover" 
               />
               <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></div>
             </div>
           </div>
          )}
      </div>
    </header>
  );
};