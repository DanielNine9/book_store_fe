import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout"; // assuming you have this layout component
import { BookDetail } from "./BookDetail";
import { FavoriteBooks } from "./FavoriteBook";
import CustomerPage from "./CustomerPage";
import { Header } from "./layout/Header";
import { CartPage } from "./Cart";
import BookList from "./BookList";
import NotFound from "../NotFound";
import TransactionList from "./Transactions";

const CustomerRoute = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CustomerPage />} />
        <Route path="/book/detail/:id" element={<BookDetail />} />
        <Route path="/favorites" element={<FavoriteBooks />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/book/list" element={<BookList />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

export default CustomerRoute;
