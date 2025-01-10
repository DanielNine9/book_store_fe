import React from 'react';

export function NewUsers() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Người dùng mới</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center space-x-3">
              <img
                src={`https://i.pravatar.cc/40?img=${index}`}
                alt="User avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">Người dùng {index + 1}</p>
                <p className="text-sm text-gray-500">user{index + 1}@example.com</p>
              </div>
            </div>
            <span className="text-sm text-gray-500">Vừa đăng ký</span>
          </div>
        ))}
      </div>
    </div>
  );
}