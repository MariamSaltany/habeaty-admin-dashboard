// kotobi-admin-dashboard-web/src/pages/BookDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';
import type { Book } from '../types';
import { Button } from '../common/Button';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, Edit3, Trash2, 
  Calendar, Fingerprint, BarChart3, 
  User as UserIcon 
} from 'lucide-react';

export const BookDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      bookService.getBySlug(slug)
        .then(response => {
            setBook(response.data);
        })
        .catch(() => {
          toast.error("ASSET RETRIEVAL FAILED");
          navigate('/books');
        })
        .finally(() => setLoading(false));
    }
  }, [slug, navigate]);

  /**
   * SENIOR ASSET RESOLVER
   * Fixes the doubled URL bug: "http://localhost:8000http://localhost:8000/..."
   * Prioritizes Base64 data if available.
   */
  const resolveBookCover = (book: Book) => {
    const cover = book.cover;
    if (!cover) return `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=f1f5f9&color=64748b&size=512`;

    // 1. Prioritize Base64 Data
    if (cover.data) return cover.data;

    // 2. Fix Doubled URL string from API
    let rawUrl = cover.url || cover.file_path;
    if (typeof rawUrl === 'string' && rawUrl.includes('http')) {
        const parts = rawUrl.split('http');
        return `http${parts[parts.length - 1]}`;
    }

    // 3. Fallback for relative paths
    if (typeof rawUrl === 'string' && rawUrl.startsWith('/')) {
        return `http://localhost:8000${rawUrl}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=f1f5f9&color=64748b&size=512`;
  };

  const handleDelete = async () => {
    if (!book) return;
    if (!window.confirm(`CONFIRM DESTRUCTION: Remove "${book.title.toUpperCase()}"?`)) return;

    try {
      setIsDeleting(true);
      await bookService.delete(book.slug);
      toast.success('RECORD PURGED');
      navigate('/books');
    } catch (err: any) {
      toast.error('DELETE FAILED');
      setIsDeleting(false);
    }
  };

  if (loading) return <LoadingGrid />;
  if (!book) return null;

  return (
    <div className="max-w-7xl mx-auto pb-24 px-6 animate-in fade-in duration-500">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <button onClick={() => navigate('/books')} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Library
          </button>
          <h2 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
            Asset <span className="text-brand-pink text-5xl">Detail</span>
          </h2>
        </div>
        
        <div className="flex gap-4">
          <Button onClick={() => navigate(`/book/edit/${book.slug}`)} className="h-14 px-8 rounded-2xl flex items-center gap-2 shadow-xl shadow-brand-pink/20">
            <Edit3 size={16} /> Edit
          </Button>
          <Button variant="secondary" onClick={handleDelete} disabled={isDeleting} className="h-14 px-8 rounded-2xl flex items-center gap-2">
            <Trash2 size={16} /> {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Cover Section */}
        <section className="lg:col-span-5">
          <div className="sticky top-10 bg-white p-6 rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
            <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden bg-slate-100 flex items-center justify-center group">
              <img 
                src={resolveBookCover(book)} 
                alt={book.title} 
                className="w-full h-full object-cover shadow-2xl transition-transform duration-1000 group-hover:scale-110"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.title)}&background=f1f5f9&color=64748b&size=512`;
                }}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-[3rem]"></div>
            </div>
          </div>
        </section>

        {/* Right: Data Section */}
        <section className="lg:col-span-7 space-y-8">
          <div className="bg-white p-12 rounded-[4.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50">
            {/* SAFE CATEGORY ACCESS */}
            <span className="inline-block px-4 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest mb-6">
              {book.category?.name ?? 'Uncategorized'}
            </span>

            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-black leading-tight mb-8">
              {book.title}
            </h1>

            <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-50">
              <InfoCell label="ISBN" icon={<Fingerprint size={12}/>} value={book.isbn} />
              <InfoCell label="Publish Year" icon={<Calendar size={12}/>} value={book.publish_year} />
              {/* SAFE PRICE ACCESS */}
              <InfoCell label="Price" icon={<BarChart3 size={12}/>} value={book.price?.formatted ?? '0.00 LYD'} highlight />
              <InfoCell label="Stock Level" icon={<BarChart3 size={12}/>} value={`${book.stock_level ?? 0} Units`} />
            </div>

            {/* SAFE OWNER ACCESS */}
            <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] space-y-4">
               <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic flex items-center gap-2">
                 <UserIcon size={14}/> Primary Owner
               </h4>
               <p className="text-xl font-black uppercase italic">
                 {book.owner ? `${book.owner.first_name} ${book.owner.last_name}` : 'No Owner Assigned'}
               </p>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-50">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Co-Authors</h4>
              <div className="flex flex-wrap gap-2">
                {book.authors && book.authors.length > 0 ? book.authors.map(author => (
                  <span key={author.id} className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest">
                    {author.first_name} {author.last_name}
                  </span>
                )) : <span className="text-slate-300 text-[10px] font-black uppercase">No contributors listed</span>}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const InfoCell = ({ label, value, icon, highlight }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 italic">
      {icon} {label}
    </label>
    <p className={`text-lg font-black uppercase italic ${highlight ? 'text-brand-pink' : 'text-black'}`}>{value}</p>
  </div>
);

const LoadingGrid = () => (
    <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-16 w-64 bg-slate-100 rounded-2xl mb-12"></div>
        <div className="grid grid-cols-12 gap-12">
            <div className="col-span-5 h-[600px] bg-slate-100 rounded-[4rem]"></div>
            <div className="col-span-7 h-[600px] bg-slate-100 rounded-[4rem]"></div>
        </div>
    </div>
);