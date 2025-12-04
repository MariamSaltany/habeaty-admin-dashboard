import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Product } from '../types';
import { Skeleton } from '../common/Skeleton';

interface AnalyticsChartProps {
    products: Product[];
    loading: boolean;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ products, loading }) => {
  const chartData = React.useMemo(() => {
     const catMap: Record<string, { total: number; count: number }> = {};
     products.forEach(p => {
         if (!catMap[p.category]) catMap[p.category] = { total: 0, count: 0 };
         catMap[p.category].total += p.price;
         catMap[p.category].count += 1;
     });
     
     return Object.keys(catMap).slice(0, 5).map(key => ({
         name: key,
         avgPrice: Math.round(catMap[key].total / catMap[key].count)
     }));
  }, [products]);

  if (loading) {
      return (
          <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-lg">
              <Skeleton variant="text" className="w-48 mb-6" />
              <div className="h-64 w-full flex items-end justify-between gap-4">
                  {[1,2,3,4,5].map(i => (
                      <Skeleton key={i} className={`w-full rounded-t-sm`} style={{ height: `${Math.random() * 80 + 20}%` }} />
                  ))}
              </div>
          </div>
      )
  }

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-lg">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-gray-500">Inventory Value by Category</h3>
        {/* Explicit style prevents Recharts width/height(-1) error before CSS loads */}
        <div className="w-full" style={{ height: '300px', minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 9, fontFamily: 'Montserrat', fontWeight: 600, fill: '#9ca3af'}} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={10}
                />
                <YAxis 
                    tick={{fontSize: 10, fontFamily: 'Montserrat', fill: '#9ca3af'}} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                    cursor={{fill: '#f5f5f5'}} 
                    contentStyle={{ 
                        fontFamily: 'Montserrat', 
                        fontSize: '11px', 
                        textTransform: 'uppercase', 
                        border: 'none', 
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px'
                    }} 
                />
                <Bar 
                    dataKey="avgPrice" 
                    fill="#0c0c0c" 
                    radius={[4, 4, 0, 0]}
                    barSize={40} 
                    animationDuration={1500}
                />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};