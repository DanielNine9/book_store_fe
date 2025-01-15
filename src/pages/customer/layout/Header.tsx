import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

export function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const username = JSON.parse(localStorage.getItem("user") || "{}")?.username;

  const [isDropdownOpen, setDropdownOpen] = useState(false); // State to handle dropdown visibility

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div onClick={() => navigate("/")} className="flex items-center">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">
              BookHaven
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600">
              Trang chủ
            </Link>
            <Link
              to="/about-us"
              className="text-gray-700 hover:text-indigo-600"
            >
              Về chúng tôi
            </Link>
            <Link
              to="/book/list"
              className="text-gray-700 hover:text-indigo-600"
            >
              Sách
            </Link>
            <Link
              to="/contact-us"
              className="text-gray-700 hover:text-indigo-600"
            >
              Liên hệ
            </Link>
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
              onClick={() => {
                navigate("/favorites");
              }}
            >
              <Heart className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </button>

            {token ? ( 
              <div className="relative">
                <div
                  onClick={() => setDropdownOpen(!isDropdownOpen)} 
                  className="flex hover-cursor"
                >
                  {username}
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                    <ul className="py-1 text-gray-700">
                      <li>
                        <button
                          onClick={() => navigate("/profile")}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => navigate("/transactions")}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Transactions
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")} // Dùng useNavigate để chuyển hướng
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
