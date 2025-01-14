import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout"; // assuming you have this layout component
import { BookDetail } from "./BookDetail";
import { FavoriteBooks } from "./FavoriteBook";
import CustomerPage from "./CustomerPage";
import { Header } from "./layout/Header";

const CustomerRoute = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/book/detail/:id" element={<BookDetail />} />
        <Route path="/favorites" element={<FavoriteBooks />} />
      </Routes>
    </Layout>
  );
};

export default CustomerRoute;
