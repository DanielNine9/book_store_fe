import React from 'react';
import { BookOpen, Search, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

interface HeaderProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
}

export function Header({ onCartClick, onWishlistClick }: HeaderProps) {
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">BookHaven</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-indigo-600">Trang chủ</a>
            <a href="#about" className="text-gray-700 hover:text-indigo-600">Về chúng tôi</a>
            <a href="#books" className="text-gray-700 hover:text-indigo-600">Sách</a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600">Liên hệ</a>
          </nav>

          <div className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sách..."
                className="w-96 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full relative"
              onClick={onWishlistClick}
            >
              <Heart className="h-6 w-6 text-gray-600" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}