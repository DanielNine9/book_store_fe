import React, { useState } from 'react';
import { Header } from './components/Header';
import { BookCard } from './components/BookCard';
// import { Cart } from './components/Cart';
import { Wishlist } from './components/Wishlist';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LoginForm } from './pages/auth/LoginForm';
import { RegisterForm } from './pages/auth/RegisterForm';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookSection from './pages/customer/BookSection';
import HeroSection from './pages/customer/HeroSection';
import ContactUs from './pages/customer/ContactUs';
import AboutUs from './pages/customer/AboutUs';
import Footer from './pages/customer/layout/Footer';
import { BookIcon, BookOpen, Coffee, Facebook, Heart, Instagram, Mail, MapPin, Phone, TrendingUp, Twitter } from 'lucide-react';



export const categories = [
  { id: 'literature', name: 'Văn học', icon: <BookIcon /> },
  { id: 'economics', name: 'Kinh tế', icon: <TrendingUp /> },
  { id: 'psychology', name: 'Tâm lý học', icon: <Heart /> },
  { id: 'lifestyle', name: 'Lifestyle', icon: <Coffee /> },
];

function App() {
  const [priceRange, setPriceRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gray-50">
            <Header onCartClick={() => setIsCartOpen(true)} onWishlistClick={() => setIsWishlistOpen(true)} />
            {/* <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> */}
            <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      
            {/* Hero Section */}
            <HeroSection/>
      
            {/* Categories */}
            <div className="max-w-7xl mx-auto px-4 py-12">
              <h2 className="text-2xl font-bold mb-8">Danh mục sách</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className={`bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${selectedCategory === category.id ? 'border-2 border-indigo-600' : ''
                      }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center">
                      {category.icon}
                      <h3 className="ml-3 text-lg font-semibold">{category.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      
            {/* Books Section */}
           <BookSection/>
      
            {/* About Us */}
           <AboutUs/>
      
            {/* Contact Us */}
          <ContactUs/>
      
            {/* Footer */}
           <Footer/>
          </div>
          }
        />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm/>} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
