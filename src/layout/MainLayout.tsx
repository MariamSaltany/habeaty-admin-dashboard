import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-brand-gray font-sans">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-grow p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full animate-slide-up">
             <Outlet />
          </div>
        </main>
        
        <footer className="py-6 text-center border-t border-gray-200/50 mx-8">
          <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">© 2025 HA Beauty Admin System</p>
        </footer>
      </div>
    </div>
  );
};