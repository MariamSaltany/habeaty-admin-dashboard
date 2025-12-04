import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProducts, searchProducts, deleteProduct } from '../services/productService';
import type { Product } from '../types';
import { Button } from '../common/Button';
import { ProductTable } from '../dashboard/ProductTable';
import { AnalyticsChart } from '../dashboard/AnalyticsChart';

export const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = search 
        ? await searchProducts(search)
        : await getProducts(100); 
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Could not load inventory.');
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(handler);
  }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const previousProducts = [...products];
      // Optimistic update - remove from UI immediately
      setProducts(prev => prev.filter(p => p.id !== id));
      
      try {
        const deletedProduct = await deleteProduct(id);
        
        // Verify deletion based on DummyJSON docs
        if (deletedProduct.isDeleted) {
            toast.success(`Product '${deletedProduct.title}' deleted successfully`);
        } else {
            toast.success('Product deleted from inventory');
        }
      } catch (error) {
        // Rollback on failure
        console.error("Delete failed:", error);
        setProducts(previousProducts);
        toast.error('Failed to delete product. It may not exist on the server.');
      }
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-3xl font-black uppercase tracking-tight text-brand-black">Overview</h2>
           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-2">Welcome back to your dashboard</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
                type="text" 
                placeholder="SEARCH INVENTORY..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-3 border-b-2 border-gray-200 bg-transparent text-xs font-bold uppercase tracking-wider focus:border-brand-pink outline-none transition-all placeholder-gray-400"
            />
          </div>
          <Button onClick={() => navigate('/product/add')} className="shadow-lg shadow-brand-pink/20">
            + Add Product
          </Button>
        </div>
      </div>

      {/* Analytics */}
      <AnalyticsChart products={products} loading={loading} />

      {/* Product Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold uppercase tracking-tight ml-1">Recent Products</h3>
        <ProductTable products={products} loading={loading} onDelete={handleDelete} />
      </div>
    </div>
  );
};