// kotobi-admin-dashboard-web/src/pages/CategoriesPage.tsx
import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Folder, X, Loader2 } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { categoryService } from '../services/categoryService';
import { toast } from 'react-toastify';

export const CategoriesPage: React.FC = () => {
  // Use the hook which already handles the complicated data mapping
  const { categories, isLoading, params, updateParams, refetch } = useCategories();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', parent_id: '' });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required.");
      return;
    }
    try {
      const payload = { 
        name: formData.name, 
        parent_id: formData.parent_id ? Number(formData.parent_id) : null 
      };

      if (editingSlug) {
        await categoryService.update(editingSlug, payload);
        toast.success('Category updated');
      } else {
        await categoryService.create(payload);
        toast.success('Category created');
      }
      
      setIsModalOpen(false);
      setFormData({ name: '', parent_id: '' });
      setEditingSlug(null);
      refetch(); // Reload data from backend
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await categoryService.delete(slug);
      toast.success('Deleted successfully');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter text-black leading-none italic">Category <br/><span className="text-brand-pink">Management</span></h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6 pl-1 border-l-2 border-slate-200">Organize your book categories</p>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4">Hierarchical classification system</p>
        </div>
        <button 
          onClick={() => { setEditingSlug(null); setFormData({name: '', parent_id: ''}); setIsModalOpen(true); }}
          className="bg-[#ff4081] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl"
        >
          <Plus size={20} /> Create Node
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        <input 
          className="w-full pl-16 pr-6 py-5 bg-white rounded-[2rem] border-0 shadow-sm focus:ring-2 focus:ring-[#ff4081] font-bold text-lg"
          placeholder="Search by name..."
          value={params.name || ''}
          onChange={(e) => updateParams({ name: e.target.value, page: 1 })}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#ff4081]" size={48} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-xl hover:shadow-2xl transition-all group relative">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-[#ff4081] group-hover:text-white transition-all">
                  <Folder size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setEditingSlug(cat.slug); setFormData({name: cat.name, parent_id: cat.parent_id?.toString() || ''}); setIsModalOpen(true); }} className="p-2 hover:text-[#ff4081]"><Edit2 size={18}/></button>
                  <button onClick={() => handleDelete(cat.slug)} className="p-2 hover:text-red-500"><Trash2 size={18}/></button>
                </div>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">{cat.name}</h3>
              <p className="text-[#ff4081] text-[10px] font-bold uppercase tracking-widest font-mono italic">/{cat.slug}</p>
            </div>
          ))}
        </div>
      )}

      {/* Senior Level Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl animate-in zoom-in-95">
            <div className="p-8 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase">{editingSlug ? 'Modify' : 'New'} Node</h2>
              <button onClick={() => setIsModalOpen(false)}><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Name</label>
                <input required className="w-full px-6 py-3 bg-gray-50 rounded-2xl font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block">Parent</label>
                <select className="w-full px-6 py-3 bg-gray-50 rounded-2xl font-bold" value={formData.parent_id} onChange={e => setFormData({...formData, parent_id: e.target.value})}>
                  <option value="">None (Root Level)</option>
                  {categories.map(c => c.slug !== editingSlug && <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-[#ff4081] text-white rounded-2xl font-bold hover:bg-black transition-all">Save Node</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};