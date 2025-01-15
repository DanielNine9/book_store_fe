import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useBooksQuery from '../../queries/BookQuery';
import { BookCard } from './components/BookCard';
import axiosInstance from '../../utils/axiosConfig';

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useBooksQuery(1, 10000);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories
  const allCategories = useMemo(() => {
    if (!data?.books) return [];
    const categories = new Set<string>();
    data.books.forEach((book: any) => {
      book.categories.forEach((cat: any) => categories.add(cat.name));
    });
    return Array.from(categories);
  }, [data?.books]);

  // Filter books
  const filteredBooks = useMemo(() => {
    if (!data?.books) return [];
    return data.books.filter((book: any) => {
      const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
      const matchesCategory = selectedCategories.length === 0 || 
        book.categories.some((cat: any) => selectedCategories.includes(cat.name));
      const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesPrice && matchesCategory && matchesSearch;
    });
  }, [data?.books, priceRange, selectedCategories, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-red-600">
          Error loading books. Please try again.
          <button 
            onClick={() => refetch()} 
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white p-4 shadow-lg">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Search</h3>
          <input
            type="text"
            placeholder="Search books..."
            className="w-full px-3 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min="0"
              max="1000000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full"
            />
            <div className="flex justify-between text-sm">
              <span>{priceRange[0].toLocaleString()}đ</span>
              <span>{priceRange[1].toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {allCategories.map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    }
                  }}
                  className="mr-2"
                />
                {category}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book: any) => (
            <BookCard 
                refetch={refetch}
                key={book.id}
                book={book}
                onViewDetail={() => {
                  navigate(`/book/detail/${book.id}`);
                }} // Open modal on card click
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookList;