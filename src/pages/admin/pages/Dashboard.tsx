import React from 'react';
import { Library, Users, Receipt, BarChart3 } from 'lucide-react';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { NewUsers } from '../components/dashboard/NewUsers';

export function DashboardContent() {
  const stats = [
    { title: 'Tổng số sách', value: '1,234', change: '+12%', icon: <Library size={24} /> },
    { title: 'Người dùng', value: '892', change: '+9%', icon: <Users size={24} /> },
    { title: 'Giao dịch tháng này', value: '156', change: '+23%', icon: <Receipt size={24} /> },
    { title: 'Doanh thu', value: '45.6M VND', change: '+18%', icon: <BarChart3 size={24} /> },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-indigo-600">{stat.icon}</div>
              <span className={`text-sm font-semibold ${
                stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions />
        <NewUsers />
      </div>
    </div>
  );
}