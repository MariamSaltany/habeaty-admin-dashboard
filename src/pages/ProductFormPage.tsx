import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById, addProduct, updateProduct } from '../services/productService';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';

export const ProductFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    stock: 0
  });

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      getProductById(id)
        .then((data) => {
          setFormData({
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category,
            brand: data.brand,
            stock: data.stock || 0
          });
        })
        .catch((err) => {
            console.error(err);
            toast.error("Failed to load product details");
            navigate('/');
        })
        .finally(() => setTimeout(() => setFetching(false), 500));
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number = value;
    if (name === 'price' || name === 'stock') {
        parsedValue = value === '' ? 0 : parseFloat(value);
    }

    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.title.trim()) throw new Error("Product title is required");
      if (formData.price < 0) throw new Error("Price cannot be negative");
      if (formData.stock < 0) throw new Error("Stock cannot be negative");

      if (isEdit) {
        await updateProduct(Number(id), formData);
        toast.success("Product updated successfully");
      } else {
        await addProduct(formData);
        toast.success("Product created successfully");
      }
      navigate('/');
    } catch (error: any) {
      console.error('Save error', error);
      toast.error(error.message || "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
      return (
        <div className="max-w-4xl mx-auto pb-12 animate-pulse space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64 w-full" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
      );
  }

  // Styles for cleaner form inputs (Editorial Style)
  const labelClass = "block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 text-gray-600";
  const inputContainerClass = "relative group";
  const inputClass = "w-full border-b border-gray-300 py-3 text-sm font-medium outline-none focus:border-brand-pink transition-colors placeholder-gray-300 bg-transparent rounded-none";

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-gray-200 pb-6">
        <div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-brand-black">
                {isEdit ? 'Edit Product' : 'New Listing'}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                {isEdit ? `Managing SKU: #${id}` : 'Add a new item to inventory'}
            </p>
        </div>
        <div className="flex gap-3">
             <Button variant="secondary" onClick={() => navigate('/')} type="button">Cancel</Button>
             <Button 
                onClick={handleSubmit} 
                isLoading={loading} 
                className="shadow-lg shadow-brand-pink/20"
             >
                {isEdit ? 'Save Changes' : 'Publish Product'}
             </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Main Details */}
        <div className="lg:col-span-2 space-y-10">
            {/* Basic Info */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-6 border-b border-gray-100 pb-2">
                    General Information
                </h3>
                
                <div className="space-y-8">
                    <div className={inputContainerClass}>
                        <label className={labelClass} htmlFor="title">Product Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`${inputClass} text-lg`}
                            placeholder="E.G. VELVET MATTE LIPSTICK"
                            autoFocus={!isEdit}
                            required
                        />
                    </div>

                    <div className={inputContainerClass}>
                        <label className={labelClass} htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={6}
                            className={inputClass}
                            placeholder="Detailed product description..."
                            required
                        />
                        <div className="flex justify-end mt-2">
                             <span className="text-[9px] text-gray-400 font-bold">{formData.description.length} CHARS</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categorization */}
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-6 border-b border-gray-100 pb-2">
                    Categorization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={inputContainerClass}>
                        <label className={labelClass} htmlFor="brand">Brand</label>
                        <input
                            id="brand"
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="E.G. HA BEAUTY"
                        />
                    </div>
                    <div className={inputContainerClass}>
                        <label className={labelClass} htmlFor="category">Category</label>
                        <input
                            id="category"
                            type="text"
                            name="category"
                            list="categories"
                            value={formData.category}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="SELECT OR TYPE..."
                            required
                        />
                        <datalist id="categories">
                            <option value="beauty">Beauty</option>
                            <option value="fragrances">Fragrances</option>
                            <option value="skin-care">Skin Care</option>
                        </datalist>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Pricing & Stats */}
        <div className="space-y-10">
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-black mb-6 border-b border-gray-100 pb-2">
                    Pricing & Inventory
                </h3>
                
                <div className="space-y-8">
                    <div className={inputContainerClass}>
                        <label className={labelClass} htmlFor="price">Base Price ($)</label>
                        <input
                            id="price"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={`${inputClass} font-bold text-brand-black`}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className={inputContainerClass}>
                        <label className={labelClass} htmlFor="stock">Stock Quantity</label>
                        <input
                            id="stock"
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            className={inputClass}
                            min="0"
                        />
                         <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-wide">
                            {formData.stock < 10 && formData.stock > 0 
                                ? <span className="text-brand-pink font-bold">Low Stock Warning</span> 
                                : 'Available Units'}
                        </p>
                    </div>

                    <div className="pt-6">
                         <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-400">
                             <span>Estimated Value</span>
                             <span className="text-brand-black">${(formData.price * formData.stock).toLocaleString()}</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>

      </form>
    </div>
  );
};