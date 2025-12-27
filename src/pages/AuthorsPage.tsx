// kotobi-admin-dashboard-web/src/pages/AuthorsPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthors } from '../hooks/useAuthors';
import { Button } from '../common/Button';
import { toast } from 'react-toastify';
import { authorService } from '../services/authorService';
import { Edit3, Trash2, ShieldCheck, ShieldAlert, Plus } from 'lucide-react';

export const AuthorsPage: React.FC = () => {
  const { authors, isLoading, refetch } = useAuthors();
  const navigate = useNavigate();

  const handleApprove = async (id: number) => {
    try {
      await authorService.approve(id);
      toast.success('ACCOUNT ACTIVATED');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleBlock = async (id: number) => {
    try {
      await authorService.block(id);
      toast.success('ACCOUNT RESTRICTED');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Block failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('CRITICAL: Purge this author record? This cannot be undone.')) return;
    try {
      await authorService.delete(id);
      toast.success('RECORD DELETED');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Header UX */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-black leading-none italic">
            Talent <br/><span className="text-brand-pink">Registry</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6 pl-1 border-l-2 border-slate-200">
            System Level: Administrator / Access Control
          </p>
        </div>
        <Button onClick={() => navigate('/author/add')} className="h-16 px-10 rounded-2xl flex items-center gap-3 shadow-xl shadow-brand-pink/20">
          <Plus size={20} />
          <span>Add Contributor</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => <div key={i} className="bg-white p-12 rounded-[3rem] h-80 animate-pulse border border-slate-50"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {authors.map(author => (
            <div key={author.id} className="group relative bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 hover:border-black transition-all duration-500 overflow-hidden">
              
              {/* Status Badge UX */}
              <div className={`absolute top-0 right-0 px-8 py-2 rounded-bl-3xl text-[9px] font-black uppercase tracking-widest text-white ${author.status === 'active' ? 'bg-green-500' : 'bg-amber-500'}`}>
                {author.status}
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-8">
                  <div className="w-28 h-28 rounded-[2.5rem] overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-700 ring-4 ring-slate-50">
                    <img 
                      src={author.photo?.data || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${author.first_name} ${author.last_name}`)}&background=000&color=fff&size=200&bold=true`} 
                      alt={author.username} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-2xl font-black uppercase tracking-tighter text-black leading-tight">
                  {author.first_name} <br/> {author.last_name}
                </h3>
                <p className="text-[10px] font-bold text-brand-pink uppercase tracking-widest italic mt-2 mb-8">@{author.username}</p>
                
                {/* Meta Info */}
                <div className="grid grid-cols-2 w-full gap-4 mb-8 pt-6 border-t border-slate-50">
                  <div className="text-left">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 block mb-1">Class</span>
                    <span className="text-[10px] font-black uppercase text-black">{author.type || 'Standard'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 block mb-1">Origin</span>
                    <span className="text-[10px] font-black uppercase text-black">{author.author_details?.country || 'Global'}</span>
                  </div>
                </div>

                {/* Actions Suite */}
                <div className="w-full flex gap-3">
                  {author.status === 'pending' ? (
                    <button 
                      onClick={() => handleApprove(author.id)}
                      className="flex-1 bg-green-500 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldCheck size={14} /> Approve
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleBlock(author.id)}
                      className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ShieldAlert size={14} /> Block
                    </button>
                  )}
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate(`/author/edit/${author.id}`)}
                      className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-black hover:bg-black hover:text-white transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(author.id)}
                      className="w-12 h-12 flex items-center justify-center bg-slate-50 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};