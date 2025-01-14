import React from 'react';
import { Home, Library, Users, Receipt, Menu, LogOut } from 'lucide-react';
import { MenuItem } from './MenuItem';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const navigate = useNavigate();  

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  return (
    <div className={`bg-indigo-800 text-white ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
      <div className="p-4 flex items-center justify-between">
        {isSidebarOpen && <h1 className="text-xl font-bold">ADMIN PORTAL</h1>}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-indigo-700 rounded">
          <Menu size={24} />
        </button>
      </div>
      <nav className="mt-8">
        <MenuItem 
          icon={<Home size={24} />}
          text="Tổng quan"
          isOpen={isSidebarOpen}
          active={activeTab === 'dashboard'}
          onClick={() => setActiveTab('dashboard')}
        />
        <MenuItem 
          icon={<Library size={24} />}
          text="Quản lý Sách"
          isOpen={isSidebarOpen}
          active={activeTab === 'books'}
          onClick={() => setActiveTab('books')}
        />
          <MenuItem 
          icon={<Library size={24} />}
          text="Quản lý Tác Giả"
          isOpen={isSidebarOpen}
          active={activeTab === 'authors'}
          onClick={() => setActiveTab('authors')}
        />
        <MenuItem 
          icon={<Users size={24} />}
          text="Quản lý User"
          isOpen={isSidebarOpen}
          active={activeTab === 'users'}
          onClick={() => setActiveTab('users')}
        />
        <MenuItem 
          icon={<Users size={24} />}
          text="Quản lý loại sách"
          isOpen={isSidebarOpen}
          active={activeTab === 'categories'}
          onClick={() => setActiveTab('categories')}
        />
        <MenuItem 
          icon={<Receipt size={24} />}
          text="Giao dịch"
          isOpen={isSidebarOpen}
          active={activeTab === 'transactions'}
          onClick={() => setActiveTab('transactions')}
        />
        <div className="mt-auto">
          <MenuItem 
            icon={<LogOut size={24} />}
            text="Đăng xuất"
            isOpen={isSidebarOpen}
            onClick={handleLogout}
          />
        </div>
      </nav>
    </div>
  );
}