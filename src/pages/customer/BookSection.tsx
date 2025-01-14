import React, { useState, useEffect } from 'react';
import useBooksQuery from '../../queries/BookQuery';
import { useNavigate } from 'react-router-dom';
import { BookCard } from './components/BookCard';

const BookSection = () => {
  const [books, setBooks] = useState([]);
  const [priceRange, setPriceRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const  navigate = useNavigate()
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const { data, isLoading, error, refetch } = useBooksQuery(
    1,
    8,
  );

  const openDetail = (book) => {
    setSelectedBook(book);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedBook(null); // Reset selected book when closing
  };

  return (
    <div>
      <div id="books" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Sách nổi bật</h2>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">Tất cả giá</option>
              <option value="under100">Dưới 100.000đ</option>
              <option value="100to200">100.000đ - 200.000đ</option>
              <option value="over200">Trên 200.000đ</option>
            </select>
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="priceAsc">Giá tăng dần</option>
              <option value="priceDesc">Giá giảm dần</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.books && data?.books.length > 0 && data.books?.map((book) => (
            <BookCard
              key={book.id} 
              book={book} 
              onViewDetail={() => {navigate(`/book/detail/${book.id}`)}} // Open modal on card click
            />
          ))}
        </div>
      </div>

     
    </div>
  );
};

export default BookSection;
