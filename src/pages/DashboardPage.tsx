// kotobi-admin-dashboard-web/src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { useAuthors } from '../hooks/useAuthors';
import { Button } from '../common/Button';
import { BookTable } from '../dashboard/BookTable';
import { AnalyticsChart } from '../dashboard/AnalyticsChart';

export const DashboardPage: React.FC = () => {
  const { books, isLoading, updateParams } = useBooks();
  const { authors } = useAuthors();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearch(value);
    updateParams({ title: value || undefined });
  };

  return (
    <div className="space-y-12 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div className="animate-slide-up">
           <h2 className="text-5xl font-black uppercase tracking-tighter text-black leading-none">Intelligence <br/><span className="text-brand-pink italic">Hub</span></h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6 pl-1 border-l-2 border-slate-200">Real-time inventory monitoring</p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-300 group-focus-within:text-brand-pink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
                type="text" 
                placeholder="FAST SEARCH..." 
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-80 pl-16 pr-8 py-5 bg-white shadow-lg shadow-slate-100 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-brand-pink outline-none transition-all placeholder-slate-300"
            />
          </div>
          <Button onClick={() => navigate('/book/add')} className="h-auto">
            + New Record
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2">
            <AnalyticsChart products={books} loading={isLoading} />
          </div>
          <div className="bg-black p-10 rounded-3xl text-white flex flex-col justify-between shadow-2xl shadow-black/20">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 block mb-10">Quick Stats</span>
                <div className="space-y-10">
                    <div>
                        <p className="text-4xl font-black italic tracking-tighter leading-none mb-2">{books.length}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Total Volumes Managed</p>
                    </div>
                    <div>
                        <p className="text-4xl font-black italic tracking-tighter leading-none mb-2">{authors.length}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Active Authors</p>
                    </div>
                </div>
              </div>
              <div className="pt-10 border-t border-white/10 mt-10">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-brand-pink mb-4">System Integrity</p>
                  <p className="text-xs font-medium text-slate-400 leading-relaxed">Database sync healthy. All caching layers invalidated and rebuilt 4 minutes ago.</p>
              </div>
          </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black italic">Recent Inventory Updates</h3>
            <Button variant="secondary" className="px-5 py-2 text-[8px]" onClick={() => navigate('/books')}>View Full Archive</Button>
        </div>
        <BookTable books={books.slice(0, 5)} loading={isLoading} />
      </div>
    </div>
  );
};