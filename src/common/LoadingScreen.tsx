import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray/50 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-pink rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 animate-pulse">Loading Application...</p>
      </div>
    </div>
  );
};