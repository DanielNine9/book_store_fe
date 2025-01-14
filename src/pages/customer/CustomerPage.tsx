import React, { useState } from 'react';
import BookSection from './BookSection';
import AboutUs from './AboutUs';
import ContactUs from './ContactUs';
import Footer from './layout/Footer';
import HeroSection from './HeroSection';
import { Wishlist } from '../../components/Wishlist';
import { Header } from './layout/Header';
import { BookIcon, Coffee, Heart, TrendingUp } from 'lucide-react';


function CustomerPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

 const categories = [
    { id: "literature", name: "Văn học", icon: <BookIcon /> },
    { id: "economics", name: "Kinh tế", icon: <TrendingUp /> },
    { id: "psychology", name: "Tâm lý học", icon: <Heart /> },
    { id: "lifestyle", name: "Lifestyle", icon: <Coffee /> },
  ];

    const [selectedCategory, setSelectedCategory] = useState("all");
//   const renderContent = () => {
//     switch (activeTab) {
//       case 'dashboard':
//         return <DashboardContent />;
//       case 'categories':
//         return <CategoriesContent />;
//       case 'books':
//         return <BooksContent />;
//       case 'users':
//         return <UsersContent />;
//       case 'transactions':
//         return <TransactionsContent />;
//       case 'authors':
//         return <AuthorsContent />;
//       default:
//         return <DashboardContent />;
//     }
//   };

  return (
    <div className="min-h-screen bg-gray-50">
    <HeroSection />

    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Danh mục sách</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
              selectedCategory === category.id
                ? "border-2 border-indigo-600"
                : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <div className="flex items-center">
              {category.icon}
              <h3 className="ml-3 text-lg font-semibold">
                {category.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>

    <BookSection />

    <AboutUs />

    <ContactUs />
  </div>
  
  );
}

export default CustomerPage;