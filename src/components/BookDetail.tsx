import React from 'react';
import { X, Star, BookOpen, Clock, Award } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

interface BookDetailProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetail({ book, isOpen, onClose }: BookDetailProps) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

  if (!isOpen) return null;

  const toggleWishlist = () => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết sách</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Image */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img 
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <BookOpen className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">300 trang</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <Clock className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">6-8 giờ đọc</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <Award className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Bestseller</p>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-600 font-medium">{book.category}</span>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">(150 đánh giá)</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mt-1">Tác giả: {book.author}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Giới thiệu sách</h3>
                <p className="text-gray-600 leading-relaxed">
                  Một cuốn sách tuyệt vời khám phá những khía cạnh sâu sắc về {book.title.toLowerCase()}. 
                  Tác giả {book.author} đã mang đến cho độc giả một góc nhìn mới mẻ và độc đáo về chủ đề này. 
                  Thông qua những phân tích sâu sắc và ví dụ thực tế, cuốn sách giúp người đọc hiểu rõ hơn về 
                  bản chất của vấn đề và cách áp dụng những kiến thức này vào cuộc sống hàng ngày.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Thông tin chi tiết</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Nhà xuất bản</p>
                    <p className="font-medium">NXB Trẻ</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Năm xuất bản</p>
                    <p className="font-medium">2024</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số trang</p>
                    <p className="font-medium">300 trang</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngôn ngữ</p>
                    <p className="font-medium">Tiếng Việt</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-indigo-600">{book.price}</p>
                    <p className="text-sm text-gray-600">Đã bao gồm thuế</p>
                  </div>
                  <button
                    onClick={toggleWishlist}
                    className={`p-2 rounded-full border ${
                      isInWishlist(book.id)
                        ? 'bg-red-50 border-red-200 text-red-500'
                        : 'border-gray-200 text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <Star className={`h-6 w-6 ${isInWishlist(book.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <button
                  onClick={() => addToCart(book)}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}