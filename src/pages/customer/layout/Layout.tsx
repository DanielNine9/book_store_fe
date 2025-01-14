import React from 'react';
import Footer from './Footer'; 
import { Header } from './Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
