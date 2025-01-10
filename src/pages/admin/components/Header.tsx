import React from 'react';

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto px-4 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          {activeTab === 'dashboard' && 'Tổng quan'}
          {activeTab === 'books' && 'Quản lý Sách'}
          {activeTab === 'users' && 'Quản lý User'}
          {activeTab === 'transactions' && 'Giao dịch'}
        </h1>
      </div>
    </header>
  );
}