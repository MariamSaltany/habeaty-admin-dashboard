import React from 'react';
import type { Book } from '../types';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { useNavigate } from 'react-router-dom';

interface BookTableProps {
  books: Book[];
  loading: boolean;
}

export const BookTable: React.FC<BookTableProps> = ({ books, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white shadow-sm border border-slate-100 rounded-2xl overflow-hidden p-8">
        <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-6 items-center">
                <Skeleton className="w-16 h-20" />
                <div className="flex-1 space-y-3">
                    <Skeleton variant="text" className="w-1/3" />
                    <Skeleton variant="text" className="w-1/4 h-3" />
                </div>
                <Skeleton className="w-24 h-10" />
            </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black text-white text-[9px] font-black uppercase tracking-[0.3em]">
            <tr>
              <th className="p-8">Inventory Item</th>
              <th className="p-8 hidden md:table-cell">Taxonomy</th>
              <th className="p-8">Valuation</th>
              <th className="p-8 hidden lg:table-cell">Status</th>
              <th className="p-8 text-right">Commands</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-sm font-medium">
            {books.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-20 text-center text-[10px] font-black uppercase tracking-widest text-slate-300 italic">
                        No matches found in database.
                    </td>
                </tr>
            ) : (
                books.map(book => (
                <tr key={book.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-8 flex items-center gap-6">
                        <div className="relative w-14 h-20 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                            <img 
                                src={book.cover?.data || `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=f1f5f9&color=64748b&size=150&bold=true`} 
                                alt={book.title} 
                                className="w-full h-full object-cover rounded shadow-sm bg-slate-100"
                                loading="lazy" 
                            />
                        </div>
                        <div className="min-w-0">
                            <span className="block font-black text-black uppercase tracking-tight text-sm line-clamp-1">{book.title}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1 block">ISBN: {book.isbn}</span>
                        </div>
                    </td>
                    <td className="p-8 hidden md:table-cell">
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-sm">{book.category?.name || 'General'}</span>
                    </td>
                    <td className="p-8">
                        <span className="font-black text-brand-pink text-base">{book.price.formatted}</span>
                    </td>
                    <td className="p-8 hidden lg:table-cell">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${book.stock_level < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                            {book.stock_level} Units
                        </span>
                    </td>
                    <td className="p-8 text-right">
                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="secondary" 
                                className="px-4 py-2" 
                                onClick={() => navigate(`/book/${book.slug}`)}
                            >
                                Details
                            </Button>
                            <Button 
                                className="px-4 py-2" 
                                onClick={() => navigate(`/book/edit/${book.slug}`)}
                            >
                                Edit
                            </Button>
                        </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};