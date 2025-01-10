import React from 'react';
import { Heart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onViewDetail: (book: Book) => void;
}

export function BookCard({ book, onViewDetail }: BookCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  // Hàm để thay đổi trạng thái trong wishlist
  const toggleWishlist = () => {
    if (isInWishlist(book.ID)) {
      removeFromWishlist(book.ID);
    } else {
      addToWishlist(book);
    }
  };

  // Nếu không có trường hình ảnh, sẽ sử dụng ảnh mặc định
  const bookImage = book.image_url || 'path/to/default-image.jpg'; // Thêm đường dẫn ảnh mặc định

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={bookImage} // Lấy hình ảnh từ book.image_url hoặc ảnh mặc định
          alt={book.title} 
          className="w-full h-64 object-cover rounded-t-lg cursor-pointer"
          onClick={() => onViewDetail(book)}
        />
        <button 
          className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 ${
            isInWishlist(book.ID) ? 'text-red-500' : 'text-gray-600'
          }`}
          onClick={toggleWishlist}
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4">
        <span className="text-sm text-indigo-600 font-medium">{book.category.name}</span> {/* Lấy tên danh mục */}
        <h3 
          className="font-semibold text-lg mb-2 cursor-pointer hover:text-indigo-600"
          onClick={() => onViewDetail(book)}
        >
          {book.title}
        </h3>
        <p className="text-gray-600 mb-2">{book.author.name}</p> {/* Lấy tên tác giả */}
        <div className="flex items-center justify-between">
          <span className="text-indigo-600 font-bold">{book.price}</span>
          <button 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            onClick={() => addToCart(book)}
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
