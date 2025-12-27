// kotobi-admin-dashboard-web/src/pages/BookFormPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookService } from '../services/bookService';
import { useCategories } from '../hooks/useCategories';
import { useAuthors } from '../hooks/useAuthors';
import { Button } from '../common/Button';
import { LoadingScreen } from '../common/LoadingScreen';
import { 
  BookOpen, Hash, Camera, 
  Layers, Users, AlertCircle 
} from 'lucide-react';

export const BookFormPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEdit = !!slug;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const { categories } = useCategories();
  const { authors } = useAuthors();
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    publish_year: new Date().getFullYear(),
    stock: 0, 
    price: 0,
    category_id: '',
    owner_id: '',
    author_ids: [] as number[],
    cover: null as File | null
  });

  const sanitizeUrl = (url: string | undefined | null) => {
    if (!url) return null;
    if (url.includes('http')) {
      const parts = url.split('http');
      return `http${parts[parts.length - 1]}`;
    }
    return url.startsWith('/') ? `http://localhost:8000${url}` : url;
  };

  useEffect(() => {
    if (isEdit && slug) {
      setFetching(true);
      bookService.getBySlug(slug)
        .then((response) => {
          const book = response.data;
          const sanitizedPhoto = sanitizeUrl(book.cover?.url || book.cover?.data);

          setFormData({
            title: book.title,
            isbn: book.isbn,
            publish_year: book.publish_year,
            stock: book.stock ?? book.stock_level ?? 0,
            price: book.price?.amount ?? 0,
            category_id: book.category?.id.toString() || '',
            owner_id: book.owner?.id.toString() || '',
            author_ids: (book.authors || [])
              .filter((a: any) => a.id !== book.owner?.id)
              .map((a: any) => a.id)
          });

          if (sanitizedPhoto) setPreview(sanitizedPhoto);
        })
        .catch(() => {
            toast.error("DATA RETRIEVAL FAILURE");
            navigate('/books');
        })
        .finally(() => setFetching(false));
    }
  }, [slug, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const parsedValue = ['price', 'stock', 'publish_year'].includes(name) 
      ? (value === '' ? 0 : parseFloat(value)) 
      : value;
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFormData(prev => ({ ...prev, cover: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const toggleCoAuthor = (id: number) => {
    setFormData(prev => ({
      ...prev,
      author_ids: prev.author_ids.includes(id) 
        ? prev.author_ids.filter(aid => aid !== id) 
        : [...prev.author_ids, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerErrors({});

    const payload = new FormData();
    if (isEdit) payload.append('_method', 'PUT');

    payload.append('title', formData.title);
    payload.append('category_id', formData.category_id);
    payload.append('isbn', formData.isbn);
    payload.append('price', formData.price.toString());
    payload.append('publish_year', formData.publish_year.toString());
    payload.append('stock', formData.stock.toString());
    payload.append('owner_id', formData.owner_id);
    
    // Append Authors: Ensure we don't send the owner as a co-author
    const coAuthors = formData.author_ids.filter(id => id !== Number(formData.owner_id));
    coAuthors.forEach(id => payload.append('author_ids[]', id.toString()));

    if (formData.cover instanceof File) {
      payload.append('cover', formData.cover);
    }

    try {
      if (isEdit) {
        await bookService.update(slug!, payload);
      } else {
        await bookService.create(payload);
      }
      toast.success("DATABASE SYNCHRONIZED");
      navigate('/books');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setServerErrors(err.response.data.errors);
        toast.error("VALIDATION FAILED");
      } else {
        toast.error("BACKEND COMMUNICATION ERROR");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingScreen />;

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24 animate-in fade-in duration-500">
      <div className="mb-16">
        <h2 className="text-7xl font-black uppercase tracking-tighter italic">
          {isEdit ? 'Modify' : 'Archive'} <br/>
          <span className="text-brand-pink text-6xl italic">Book Asset</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* SIDEBAR: PHOTO */}
        <div className="lg:col-span-4">
          <div className="sticky top-10 space-y-6">
            <div className={`p-8 bg-white border-4 rounded-[3rem] transition-all ${serverErrors.cover ? 'border-red-500 shadow-red-100' : 'border-slate-50 shadow-2xl shadow-slate-200'}`}>
              <div className="relative aspect-[3/4] bg-slate-50 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 group">
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-300">
                    <Camera size={40} />
                    <span className="text-[10px] font-black mt-2 uppercase">Attach Cover</span>
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              {serverErrors.cover && <p className="text-[8px] font-black text-red-500 uppercase mt-4 text-center">{serverErrors.cover[0]}</p>}
            </div>
          </div>
        </div>

        {/* MAIN FORM */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-slate-200 border border-slate-50 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <DataField label="Book Title" icon={<BookOpen size={14}/>} name="title" value={formData.title} onChange={handleChange} error={serverErrors.title} />
              <DataField label="ISBN Registry" icon={<Hash size={14}/>} name="isbn" value={formData.isbn} onChange={handleChange} error={serverErrors.isbn} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-black rounded-[3rem] text-white">
              <DataField label="Price (LYD)" name="price" type="number" value={formData.price} onChange={handleChange} error={serverErrors.price} dark />
              <DataField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} error={serverErrors.stock} dark />
              <DataField label="Publish Year" name="publish_year" type="number" value={formData.publish_year} onChange={handleChange} error={serverErrors.publish_year} dark />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <DataSelect label="Category" icon={<Layers size={14}/>} name="category_id" value={formData.category_id} onChange={handleChange} options={categories} error={serverErrors.category_id} />
              <DataSelect label="Primary Owner" icon={<Users size={14}/>} name="owner_id" value={formData.owner_id} onChange={handleChange} options={authors?.map(a => ({ id: a.id, name: `${a.first_name} ${a.last_name}` }))} error={serverErrors.owner_id} />
            </div>

            {/* CO-AUTHORS SECTION */}
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic flex justify-between">
                Collaborating Authors (Excluding Owner)
                <span className="text-brand-pink">{formData.author_ids.length} Selected</span>
              </label>
              <div className="flex flex-wrap gap-3 p-6 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                {authors?.filter(a => a.id !== Number(formData.owner_id)).map(author => {
                  const active = formData.author_ids.includes(author.id);
                  return (
                    <button key={author.id} type="button" onClick={() => toggleCoAuthor(author.id)}
                      className={`px-6 py-3 rounded-2xl text-[9px] font-black uppercase transition-all border-2 ${
                        active ? 'bg-brand-pink border-brand-pink text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-brand-pink'
                      }`}
                    >
                      {author.first_name} {author.last_name}
                    </button>
                  );
                })}
                {authors?.filter(a => a.id !== Number(formData.owner_id)).length === 0 && (
                  <span className="text-[10px] text-slate-300 font-bold uppercase italic">No candidates available</span>
                )}
              </div>
              {serverErrors.author_ids && <p className="text-[8px] font-black text-red-500 uppercase">{serverErrors.author_ids[0]}</p>}
            </div>

            <div className="flex justify-end gap-6 pt-10 border-t border-slate-50">
              <Button type="button" variant="outline" onClick={() => navigate('/books')} className="px-10 rounded-2xl">Abort</Button>
              <Button type="submit" isLoading={loading} className="px-14 rounded-2xl shadow-xl shadow-brand-pink/20">Commit Asset</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

/* Internal UI Components */

const DataField = ({ label, icon, dark, error, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${dark ? 'text-slate-500' : 'text-slate-400'}`}>
      {icon} {label}
    </label>
    <input {...props} className={`bg-transparent py-4 text-sm font-black outline-none border-b-4 transition-all ${
        error ? 'border-red-500 text-red-500' : (dark ? 'border-slate-800 focus:border-white text-white' : 'border-slate-50 focus:border-brand-pink text-black')
      }`}
    />
    {error && <span className="text-[8px] font-black text-red-500 uppercase italic mt-1">{error[0]}</span>}
  </div>
);

const DataSelect = ({ label, icon, options, error, ...props }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">{icon} {label}</label>
    <select {...props} className={`px-8 py-5 rounded-[2rem] text-[10px] font-black uppercase outline-none border-2 transition-all appearance-none cursor-pointer ${
      error ? 'border-red-500 bg-red-50' : 'bg-slate-50 border-transparent focus:bg-white focus:border-brand-pink'
    }`}>
      <option value="">Select {label}</option>
      {options?.map((opt: any) => <option key={opt.id} value={opt.id}>{opt.name.toUpperCase()}</option>)}
    </select>
    {error && <span className="text-[8px] font-black text-red-500 uppercase italic mt-1">{error[0]}</span>}
  </div>
);