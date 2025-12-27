// kotobi-admin-dashboard-web/src/pages/BooksPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { useCategories } from '../hooks/useCategories';
import { Button } from '../common/Button';
import { BookTable } from '../dashboard/BookTable';

export const BooksPage: React.FC = () => {
  const { books, isLoading, updateParams, pagination } = useBooks();
  const { categories } = useCategories();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearch(value);
    updateParams({ title: value || undefined });
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    updateParams({ category_id: categoryId || undefined });
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div>
           <h2 className="text-5xl font-black uppercase tracking-tighter text-black leading-none italic">Book <br/><span className="text-brand-pink">Inventory</span></h2>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6 pl-1 border-l-2 border-slate-200">Manage your book collection</p>
        </div>
        <div className="flex flex-wrap w-full lg:w-auto gap-4">
          <div className="relative group flex-1 min-w-[200px]">
            <input 
                type="text" 
                placeholder="SEARCH ARCHIVE..." 
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-8 py-5 bg-white shadow-lg shadow-slate-100 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-brand-pink outline-none transition-all placeholder-slate-300"
            />
          </div>
          <select
            value={selectedCategory || ''}
            onChange={(e) => handleCategoryChange(e.target.value ? Number(e.target.value) : null)}
            className="px-8 py-5 bg-white shadow-lg shadow-slate-100 border-none rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] focus:ring-2 focus:ring-brand-pink outline-none appearance-none min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <Button onClick={() => navigate('/book/add')} className="h-auto">
            + New Item
          </Button>
        </div>
      </div>

      <div className="space-y-10">
        <BookTable books={books} loading={isLoading} />
       
        {pagination && pagination.last_page > 1 && (
          <div className="flex justify-center items-center gap-6 mt-12">
            <Button
              variant="secondary"
              onClick={() => updateParams({ page: (pagination.current_page || 1) - 1 })}
              disabled={pagination.current_page === 1}
              className="px-6 py-3"
            >
              Previous
            </Button>
           
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 bg-slate-100 px-6 py-3 rounded-full">
              {pagination.current_page} / {pagination.last_page}
            </span>
           
            <Button
              variant="secondary"
              onClick={() => updateParams({ page: (pagination.current_page || 1) + 1 })}
              disabled={pagination.current_page === pagination.last_page}
              className="px-6 py-3"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};