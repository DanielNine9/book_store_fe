import React, { useState, useEffect } from 'react';
import { Heart, X, Loader2, BookOpen, User, Calendar, Box } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import { CustomToast } from '../../components/Toast';
import toast from 'react-hot-toast';

export function FavoriteBooks() {
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user?.token;
      
      try {
        setLoading(true);
        const response = await axiosInstance.get('/favorites/', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.status === 200) {
          setFavoriteBooks(response.data.favorite_books);
        } else {
          setError('Không thể tải danh sách sách yêu thích');
        }
      } catch (error) {
        setError('Đã xảy ra lỗi khi tải danh sách sách yêu thích');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, []);

  const removeFromFavorites = async (favoriteId: number) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    try {
      await axiosInstance.delete(`/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFavoriteBooks((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.ID !== favoriteId)
      );
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-gray-600">Đang tải danh sách...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-red-50 p-6 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

 
  const handleAddToCart = async (book: any) => {
    try {
      const response = await axiosInstance.post(`/purchases/${book.ID}`, {
        quantity: 1
      });
      
      if (response.status === 200 || response.status === 201) {
        toast.custom((t) => (
          <CustomToast
            t={t}
            message={`Đã thêm "${book.title}" vào giỏ hàng`}
            type="success"
          />
        ));
      }
    } catch (error) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Không thể thêm vào giỏ hàng. Vui lòng thử lại!"
          type="error"
        />
      ));
      console.error("Error:", error);
    } 
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b border-gray-200 pb-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sách Yêu Thích</h1>
              <p className="mt-2 text-gray-600">
                {favoriteBooks.length} cuốn sách trong danh sách yêu thích của bạn
              </p>
            </div>
            <Link
              to="/book/list"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Khám phá thêm sách
            </Link>
          </div>
        </div>

        {favoriteBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Chưa có sách yêu thích
            </h3>
            <p className="text-gray-500 mb-6">
              Hãy thêm những cuốn sách bạn yêu thích vào đây để xem lại sau nhé!
            </p>
            <Link
              to="/books"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Khám phá sách ngay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteBooks.map((favorite) => (
              <div 
                key={favorite.ID} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={favorite.book.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
                    alt={favorite.book.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-200"
                  />
                  <button
                    onClick={() => removeFromFavorites(favorite.ID)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-red-50 transition-colors duration-200 group"
                    title="Xóa khỏi yêu thích"
                  >
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {favorite.book.title}
                      </h3>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <User className="h-4 w-4 mr-1" />
                        <span>{favorite.book.author?.name || 'Chưa có tác giả'}</span>
                      </div>
                    </div>
                    <span className="text-lg font-medium text-indigo-600">
                      {formatPrice(favorite.book.price)}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Xuất bản: {favorite.book.book_detail?.publication_year || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Box className="h-4 w-4 mr-1" />
                      <span>Còn {favorite.book.quantity_in_stock} cuốn</span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-gray-600 line-clamp-2">
                    {favorite.book.description || 'Chưa có mô tả'}
                  </p>

                  <div className="mt-6 flex items-center justify-between">
                    <Link
                      to={`/book/detail/${favorite.book.ID}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Xem chi tiết →
                    </Link>
                    <button
                      onClick={() => handleAddToCart(favorite.book)}
                      className="inline-flex items-center px-3 py-1.5 border border-indigo-600 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}