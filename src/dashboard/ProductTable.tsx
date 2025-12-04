import React from 'react';
import type { Product } from '../types';
import { Button } from '../common/Button';
import { Skeleton } from '../common/Skeleton';
import { useNavigate } from 'react-router-dom';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, loading, onDelete }) => {
  const navigate = useNavigate();

  const handleRowClick = (id: number) => {
    navigate(`/product/${id}`);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent triggering row click
    onDelete(id);
  };

  const handleEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation(); // Prevent triggering row click
    navigate(`/product/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
        <div className="hidden md:flex p-4 border-b border-gray-100 gap-4">
             <Skeleton className="h-8 w-24" />
             <Skeleton className="h-8 w-full" />
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex flex-col md:flex-row items-center justify-between border-b border-gray-50 gap-4">
            <div className="flex items-center gap-4 w-full md:w-1/3">
              <Skeleton variant="rectangular" className="w-16 h-16 md:w-10 md:h-10" />
              <div className="space-y-2 flex-1">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2 h-3" />
              </div>
            </div>
            <Skeleton variant="text" className="w-full md:w-20 hidden md:block" />
            <Skeleton variant="text" className="w-full md:w-20 hidden md:block" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
      
      {/* Mobile View: Card List */}
      <div className="md:hidden divide-y divide-gray-100">
        {products.length === 0 ? (
           <div className="p-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
             No products found.
           </div>
        ) : (
          products.map(product => (
            <div 
              key={product.id} 
              onClick={() => handleRowClick(product.id)}
              className="p-4 flex gap-4 active:bg-gray-50 transition-colors cursor-pointer group relative"
            >
              <div className="relative w-20 h-24 flex-shrink-0">
                <img 
                  src={product.thumbnail} 
                  alt={product.title} 
                  className="w-full h-full object-cover rounded-sm bg-gray-50 border border-gray-100"
                  loading="lazy" 
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-between py-1 pr-6">
                <div>
                  <h4 className="font-bold text-brand-black text-sm line-clamp-2 leading-tight">{product.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase tracking-wide text-gray-500">{product.category}</span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <span className={`text-[9px] font-bold uppercase ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {product.stock} Left
                      </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-brand-pink text-base">${product.price}</span>
                  
                  <div className="flex gap-3 relative z-10">
                    <button 
                      onClick={(e) => handleEdit(e, product.id)}
                      className="p-2 bg-gray-100 rounded-full text-brand-black hover:bg-brand-black hover:text-white transition-all shadow-sm"
                      aria-label="Edit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button 
                      onClick={(e) => handleDelete(e, product.id)}
                      className="p-2 bg-white border border-gray-200 rounded-full text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
                      aria-label="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Chevron indicator for affordance */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest">
            <tr>
              <th className="p-4 md:pl-6">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right md:pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm font-medium text-gray-600">
            {products.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-10 text-center text-xs font-bold uppercase tracking-widest text-gray-400">
                        No products found matching your search.
                    </td>
                </tr>
            ) : (
                products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4 md:pl-6 flex items-center gap-4">
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <img 
                            src={product.thumbnail} 
                            alt={product.title} 
                            className="w-full h-full object-cover rounded-sm bg-gray-100"
                            loading="lazy" 
                        />
                    </div>
                    <div>
                        <span className="block font-bold text-brand-black uppercase tracking-wide text-xs line-clamp-1">{product.title}</span>
                        <span className="text-[9px] uppercase tracking-wider text-gray-400">{product.brand}</span>
                    </div>
                    </td>
                    <td className="p-4 text-xs uppercase tracking-wider text-gray-400">{product.category}</td>
                    <td className="p-4 font-bold text-brand-pink">${product.price}</td>
                    <td className="p-4 text-xs">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${product.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                            {product.stock} left
                        </span>
                    </td>
                    <td className="p-4 text-right md:pr-6">
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" className="py-1 px-3 text-[9px] h-8" onClick={() => handleRowClick(product.id)}>View</Button>
                        <Button variant="secondary" className="py-1 px-3 text-[9px] h-8" onClick={(e) => handleEdit(e, product.id)}>Edit</Button>
                        <button 
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            onClick={(e) => handleDelete(e, product.id)}
                            title="Delete"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
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