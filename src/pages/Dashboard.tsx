// kotobi-admin-dashboard-web/src/pages/Dashboard.tsx
import React from 'react';
import { 
  BookOpen, 
  Users, 
  Layers, 
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Total Books', value: '2,450', icon: BookOpen, color: 'bg-blue-500', trend: '+12%' },
    { name: 'Active Authors', value: '180', icon: Users, color: 'bg-purple-500', trend: '+5%' },
    { name: 'Categories', value: '24', icon: Layers, color: 'bg-orange-500', trend: 'Stable' },
    { name: 'Revenue', value: '$12.5k', icon: TrendingUp, color: 'bg-green-500', trend: '+18%' },
  ];

  const recentBooks = [
    { title: 'The Art of Clean Code', author: 'Naguib Mahfouz', status: 'Available', date: '2 hours ago' },
    { title: 'Mastering Laravel', author: 'Elif Shafak', status: 'In Review', date: '5 hours ago' },
    { title: 'Design Patterns', author: 'Naguib Mahfouz', status: 'Out of Stock', date: '1 day ago' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Library Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-xl bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Books</h3>
            <Link to="/books" className="text-sm text-indigo-600 font-medium flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Book Title</th>
                  <th className="px-6 py-4 font-semibold">Author</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentBooks.map((book, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-gray-600">{book.author}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        book.status === 'Available' ? 'bg-green-100 text-green-700' : 
                        book.status === 'In Review' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {book.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link to="/books" className="flex items-center gap-4 p-4 border rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
              <div className="bg-indigo-600 text-white p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add New Book</p>
                <p className="text-xs text-gray-500">Register a new title in the system</p>
              </div>
            </Link>
            <Link to="/authors" className="flex items-center gap-4 p-4 border rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group">
              <div className="bg-purple-600 text-white p-2.5 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Manage Authors</p>
                <p className="text-xs text-gray-500">Update author profiles and bios</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
