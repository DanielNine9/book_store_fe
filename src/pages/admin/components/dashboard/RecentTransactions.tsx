import React from 'react';
import { Receipt } from 'lucide-react';

export function RecentTransactions() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Thống kê giao dịch gần đây</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Receipt size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-medium">Mượn sách #{1000 + index}</p>
                <p className="text-sm text-gray-500">2 giờ trước</p>
              </div>
            </div>
            <span className="text-indigo-600 font-medium">Chi tiết</span>
          </div>
        ))}
      </div>
    </div>
  );
}