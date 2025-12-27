// kotobi-admin-dashboard-web/src/pages/AuthorFormPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authorService } from '../services/authorService';
import { Button } from '../common/Button';
import { LoadingScreen } from '../common/LoadingScreen';
import { User, Shield, MapPin, AlignLeft, Camera } from 'lucide-react';

export const AuthorFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    bio: '',
    country: '',
    photo: null as File | null | string
  });

  useEffect(() => {
    if (isEdit && id) {
      setFetching(true);
      authorService.getById(Number(id))
        .then(response => {
          const author = response.data;
          setFormData({
            username: author.username,
            first_name: author.first_name,
            last_name: author.last_name,
            password: '', 
            bio: author.author_details?.bio || '',
            country: author.author_details?.country || '',
            photo: author.photo?.data || null
          });
          if (author.photo?.data) setPreview(author.photo.data);
        })
        .catch(() => {
          toast.error("DATA RETRIEVAL FAILED");
          navigate('/authors');
        })
        .finally(() => setFetching(false));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, photo: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setServerErrors({});

    const payload = new FormData();
    if (isEdit) payload.append('_method', 'PUT');

    payload.append('username', formData.username);
    payload.append('first_name', formData.first_name);
    payload.append('last_name', formData.last_name);
    if (!isEdit && formData.password) payload.append('password', formData.password);
    payload.append('bio', formData.bio);
    payload.append('country', formData.country);

    if (formData.photo instanceof File) {
      payload.append('photo', formData.photo);
    }

    try {
      if (isEdit && id) {
        await authorService.update(Number(id), payload);
      } else {
        await authorService.create(payload);
      }
      toast.success(isEdit ? "TALENT PROFILE UPDATED" : "NEW TALENT REGISTERED");
      navigate('/authors');
    } catch (err: any) {
      if (err.response?.status === 422) {
        setServerErrors(err.response.data.errors);
        toast.error("VALIDATION REJECTED");
      } else {
        toast.error("SYSTEM EXCEPTION");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <LoadingScreen />;

  return (
    <div className="max-w-5xl mx-auto pb-20 px-4">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black uppercase tracking-tighter text-black italic leading-none">
            {isEdit ? 'Edit' : 'Register'} <br/><span className="text-brand-pink text-5xl">Contributor</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-6 pl-1 border-l-2 border-slate-200 uppercase">Registry Protocol v1.0</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar: Photo Upload */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 flex flex-col items-center">
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-400 mb-8 w-full text-center">Identity Asset</label>
            <div className="relative group cursor-pointer w-48 h-48 rounded-[3rem] overflow-hidden bg-slate-50 border-4 border-dashed border-slate-200 hover:border-brand-pink transition-all">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <Camera size={32} strokeWidth={1.5} />
                  <span className="text-[8px] font-black mt-2">UPLOAD</span>
                </div>
              )}
              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
            </div>
            <p className="text-[8px] font-bold text-slate-300 mt-6 uppercase text-center leading-relaxed">Accepted formats: <br/>JPG, PNG, WEBP (Max 2MB)</p>
          </div>
        </div>

        {/* Main Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
              <FormField label="Username" icon={<User size={12}/>} name="username" value={formData.username} onChange={handleChange} error={serverErrors.username} />
              {!isEdit && <FormField label="Access Key" icon={<Shield size={12}/>} name="password" type="password" value={formData.password} onChange={handleChange} error={serverErrors.password} />}
              <FormField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} error={serverErrors.first_name} />
              <FormField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={serverErrors.last_name} />
              <div className="md:col-span-2">
                <FormField label="Nationality/Region" icon={<MapPin size={12}/>} name="country" value={formData.country} onChange={handleChange} error={serverErrors.country} />
              </div>
              <div className="md:col-span-2">
                 <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 italic"><AlignLeft size={12}/> Professional Bio</label>
                 <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-sm font-bold focus:border-brand-pink outline-none transition-all resize-none" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => navigate('/authors')} className="px-8 border-2">ABORT</Button>
              <Button type="submit" isLoading={loading} className="px-12 shadow-xl shadow-brand-pink/20">COMMIT CHANGES</Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Reusable Sub-component for clean code
const FormField = ({ label, name, type = "text", value, onChange, error, icon }: any) => (
  <div className="group">
    <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 italic group-focus-within:text-brand-pink transition-colors">
      {icon} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] text-sm font-black focus:bg-white focus:border-brand-pink outline-none transition-all"
      required={name !== 'password' || false}
    />
    {error && <p className="text-[8px] font-black text-red-500 mt-2 tracking-widest uppercase">{error[0]}</p>}
  </div>
);