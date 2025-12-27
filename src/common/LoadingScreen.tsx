import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-50 fixed inset-0">
      <div className="flex flex-col items-center">
        <div className="w-16 h-1 w-24 bg-slate-200 overflow-hidden rounded-full mb-4">
            <div className="h-full bg-brand-pink animate-[loading_1s_infinite]"></div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 animate-pulse">Initializing Interface...</p>
      </div>
      <style>{`
        @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};