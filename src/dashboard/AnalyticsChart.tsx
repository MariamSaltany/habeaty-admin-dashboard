import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Book } from '../types';
import { Skeleton } from '../common/Skeleton';

interface AnalyticsChartProps {
    products: Book[];
    loading: boolean;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ products, loading }) => {
  const chartData = React.useMemo(() => {
     const catMap: Record<string, { total: number; count: number }> = {};
     products.forEach(p => {
         const catName = p.category?.name || 'Uncategorized';
         if (!catMap[catName]) catMap[catName] = { total: 0, count: 0 };
         catMap[catName].total += p.price.amount;
         catMap[catName].count += 1;
     });
     
     return Object.keys(catMap).slice(0, 5).map(key => ({
         name: key,
         avgPrice: Math.round(catMap[key].total / catMap[key].count)
     }));
  }, [products]);

  if (loading || chartData.length === 0) {
      return (
          <div className="bg-white p-10 shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl">
              <Skeleton variant="text" className="w-64 mb-10" />
              <div className="h-64 w-full flex items-end justify-between gap-8">
                  {[1,2,3,4,5].map(i => (
                      <Skeleton key={i} className="w-full rounded-t-xl" style={{ height: `${Math.random() * 80 + 20}%` }} />
                  ))}
              </div>
          </div>
      )
  }

  const COLORS = ['#000000', '#ff4081', '#1e293b', '#64748b', '#cbd5e1'];

  return (
    <div className="bg-white p-10 shadow-xl shadow-slate-200/50 border border-slate-100 rounded-3xl">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-slate-400">Inventory Valuation Index</h3>
        <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                <XAxis 
                    dataKey="name" 
                    tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}} 
                    axisLine={false} 
                    tickLine={false} 
                    dy={15}
                />
                <YAxis 
                    tick={{fontSize: 9, fontWeight: 800, fill: '#94a3b8'}} 
                    axisLine={false} 
                    tickLine={false}
                    tickFormatter={(value) => `LYD ${value}`}
                />
                <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{ 
                        fontSize: '9px', 
                        fontWeight: 900,
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em',
                        border: 'none', 
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        padding: '12px'
                    }} 
                />
                <Bar 
                    dataKey="avgPrice" 
                    radius={[6, 6, 0, 0]}
                    barSize={45} 
                    animationDuration={2000}
                >
                    {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};