// kotobi-admin-dashboard-web/src/pages/Categories.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Folder, X, Loader2 } from 'lucide-react';
import { categoryService } from '../services/categoryService';
// Use type-only imports to satisfy compiler when verbatimModuleSyntax is enabled
import type { Category } from '../types';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', parent_id: '' as string | number });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Use categoryService wrapper which already handles params
      const res = await categoryService.getAll({ name: searchTerm || undefined, include: ['childrenRecursive'] });
      // categoryService returns ApiResponse<PaginatedData<Category>>
      setCategories(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(fetchCategories, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSlug) {
        await categoryService.update(editingSlug, { name: formData.name, parent_id: formData.parent_id ? Number(formData.parent_id) : null });
      } else {
        await categoryService.create({ name: formData.name, parent_id: formData.parent_id ? Number(formData.parent_id) : null });
      }
      setIsModalOpen(false);
      setFormData({ name: '', parent_id: '' });
      setEditingSlug(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Validation failed');
    }
  };

  const deleteCategory = async (slug: string) => {
    if (!confirm('Are you sure? Sub-categories must be deleted first.')) return;
    try {
      await categoryService.delete(slug);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Could not delete category with active children');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Book Taxonomy</h1>
          <p className="text-gray-500 font-medium">Structure your library's knowledge tree</p>
        </div>
        <button onClick={() => { setIsModalOpen(true); setEditingSlug(null); setFormData({name: '', parent_id: ''}); }} className="bg-[#ff4081] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl">
          <Plus size={20} /> New Category
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          <input 
            className="w-full pl-16 pr-6 py-5 bg-gray-50 rounded-3xl border-0 focus:ring-2 focus:ring-[#ff4081] outline-none font-bold text-lg"
            placeholder="Filter categories by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading && !categories.length ? (
          <div className="col-span-full py-20 flex flex-col items-center text-gray-400">
            <Loader2 className="animate-spin mb-4" size={48} />
          </div>
        ) : categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-gray-100 text-black p-4 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                <Folder size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => { setEditingSlug(cat.slug); setFormData({name: cat.name, parent_id: cat.parent_id || ''}); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-black"><Edit2 size={16} /></button>
                <button onClick={() => deleteCategory(cat.slug)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
              </div>
            </div>
            
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-1">{cat.name}</h3>
            <p className="text-[#ff4081] text-[10px] font-black uppercase tracking-widest mb-4 font-mono">{cat.slug}</p>
            
            {cat.children && cat.children.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Subcategories</p>
                <div className="flex flex-wrap gap-2">
                  {cat.children.map(child => (
                    <span key={child.id} className="text-[10px] font-bold bg-gray-50 text-gray-600 px-3 py-1 rounded-full">{child.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tight">{editingSlug ? 'Update' : 'Create'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category Name</label>
                <input required className="w-full px-6 py-3 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#ff4081] font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Parent Category</label>
                <select className="w-full px-6 py-3 bg-gray-50 rounded-2xl border-0 focus:ring-2 focus:ring-[#ff4081] font-bold" value={formData.parent_id} onChange={e => setFormData({...formData, parent_id: e.target.value})}>
                  <option value="">No Parent (Root)</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-500 hover:text-black">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#ff4081] text-white rounded-2xl font-bold shadow-xl shadow-[#ff4081]/20 hover:bg-black transition-all">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;