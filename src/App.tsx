import React, { useState } from "react";
import { BookCard } from "./pages/customer/components/BookCard";
// import { Cart } from './components/Cart';
import { Wishlist } from "./components/Wishlist";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginForm } from "./pages/auth/LoginForm";
import { RegisterForm } from "./pages/auth/RegisterForm";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookSection from "./pages/customer/BookSection";
import HeroSection from "./pages/customer/HeroSection";
import ContactUs from "./pages/customer/ContactUs";
import AboutUs from "./pages/customer/AboutUs";
import Footer from "./pages/customer/layout/Footer";
import {
  BookIcon,
  BookOpen,
  Coffee,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  TrendingUp,
  Twitter,
} from "lucide-react";
import { BookDetail } from "./pages/customer/BookDetail";
import { FavoriteBooks } from "./pages/customer/FavoriteBook";
import { Header } from "./components/Header";
import CustomerPage from "./pages/customer/CustomerPage";
import CustomerRoute from "./pages/customer/CustomerRoute";

export const categories = [
  { id: "literature", name: "Văn học", icon: <BookIcon /> },
  { id: "economics", name: "Kinh tế", icon: <TrendingUp /> },
  { id: "psychology", name: "Tâm lý học", icon: <Heart /> },
  { id: "lifestyle", name: "Lifestyle", icon: <Coffee /> },
];

function App() {
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/*" element={<CustomerRoute />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
