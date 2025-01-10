import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardContent } from './pages/Dashboard';
import { BooksContent } from './pages/Books';
import { UsersContent } from './pages/Users';
import { TransactionsContent } from './pages/Transactions';
import { CategoriesContent } from './pages/Categories';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'categories':
        return <CategoriesContent />;
      case 'books':
        return <BooksContent />;
      case 'users':
        return <UsersContent />;
      case 'transactions':
        return <TransactionsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex-1">
        <Header activeTab={activeTab} />
        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;