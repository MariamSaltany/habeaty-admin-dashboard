import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import type { Product } from '../types';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProductById(id)
        .then(setProduct)
        .catch(console.error)
        .finally(() => setTimeout(() => setLoading(false), 500));
    }
  }, [id]);

  if (loading) {
      return (
        <div className="animate-fade-in max-w-5xl mx-auto">
             <div className="mb-8"><Skeleton className="w-24 h-10" /></div>
             <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row h-[600px]">
                 <div className="w-full md:w-1/2 bg-gray-50 p-12 flex items-center justify-center">
                     <Skeleton className="w-64 h-64 rounded-xl" />
                 </div>
                 <div className="w-full md:w-1/2 p-12 flex flex-col justify-center space-y-6">
                     <Skeleton variant="text" className="w-1/4" />
                     <Skeleton variant="text" className="w-3/4 h-12" />
                     <Skeleton variant="text" className="w-1/3 h-8" />
                     <div className="space-y-2 mt-8">
                        <Skeleton variant="text" className="w-full" />
                        <Skeleton variant="text" className="w-full" />
                        <Skeleton variant="text" className="w-2/3" />
                     </div>
                     <Skeleton className="w-1/3 h-12 mt-8" />
                 </div>
             </div>
        </div>
      );
  }

  if (!product) return <div className="text-center py-20 font-bold uppercase text-gray-400">Product not found</div>;

  return (
    <div className="animate-slide-up max-w-5xl mx-auto">
       <Button variant="secondary" onClick={() => navigate('/')} className="mb-8 hover:pl-4 transition-all">← Back to List</Button>
       
       <div className="bg-white shadow-2xl shadow-gray-200/50 rounded-lg overflow-hidden flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 p-12 flex items-center justify-center relative group">
             <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-500"></div>
             <img 
                src={product.thumbnail} 
                alt={product.title} 
                className="max-h-[400px] w-auto object-contain mix-blend-multiply drop-shadow-xl transform group-hover:scale-105 transition-transform duration-700 ease-out" 
             />
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-pink mb-4 inline-block">{product.category}</span>
             
             <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 leading-none text-brand-black">{product.title}</h1>
             
             <div className="flex items-baseline gap-4 mb-8 border-b border-gray-100 pb-8">
                 <span className="text-4xl font-medium text-brand-black">${product.price}</span>
                 {product.discountPercentage > 0 && (
                     <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                         Save {product.discountPercentage}%
                     </span>
                 )}
             </div>
             
             <div className="space-y-8 mb-10">
                 <div>
                     <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">About Product</h4>
                     <p className="text-gray-600 leading-relaxed text-sm font-medium">{product.description}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-sm">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Brand</h4>
                        <p className="font-bold text-brand-black uppercase text-sm">{product.brand}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-sm">
                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Inventory</h4>
                        <p className="font-bold text-brand-black uppercase text-sm">{product.stock} Units</p>
                    </div>
                 </div>
             </div>

             <div className="mt-auto pt-4">
                <Button onClick={() => navigate(`/product/edit/${product.id}`)} className="w-full md:w-auto shadow-lg shadow-brand-black/20">
                    Edit Listing
                </Button>
             </div>
          </div>
       </div>
    </div>
  );
};