import React, { useState, useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import axiosInstance from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';

export function FavoriteBooks() {
  const [favoriteBooks, setFavoriteBooks] = useState<any[]>([]);

  useEffect(() => {
    // Fetch danh sách sách yêu thích của người dùng
    const fetchFavoriteBooks = async () => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = user?.ID;
        const token = user?.token;
      try {
        const response = await axiosInstance.get('/favorites/',  {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        if (response.status === 200) {
          setFavoriteBooks(response.data.favorite_books);
        } else {
          console.error('Failed to fetch favorite books');
        }
      } catch (error) {
        console.error('Error fetching favorite books:', error);
      }
    };

    fetchFavoriteBooks();
  }, []);

  // Xử lý xoá sách khỏi danh sách yêu thích
  const removeFromFavorites = async (favoriteId: number) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;

    try {
      await axiosInstance.delete(`/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Cập nhật lại danh sách sách yêu thích
      setFavoriteBooks((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.ID !== favoriteId)
      );
    } catch (error) {
      console.error('Error removing book from favorites:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        <div className="border-b pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Sách yêu thích</h1>
        </div>

        {/* Favorite Books List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteBooks?.length === 0 ? (
            <p className="text-center text-lg text-gray-600">Không có sách yêu thích nào.</p>
          ) : (
            favoriteBooks?.map((favorite) => (
              <div key={favorite.ID} className="bg-white p-6 rounded-lg shadow-md">
                <div className="relative">
                  {/* Book Image */}
                  <img
                    src={favorite.book.categories?.[0]?.image_url || 'path/to/default-image.jpg'}
                    alt={favorite.book.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  {/* Remove from favorites button */}
                  <button
                    onClick={() => removeFromFavorites(favorite.ID)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Book Details */}
                <h3 className="text-xl font-semibold text-gray-900">{favorite.book.title}</h3>
                <p className="text-sm text-gray-600">{favorite.book.author?.name}</p>
                <p className="text-gray-600 mt-2">{favorite.book.description || 'No description available'}</p>

                {/* Link to Book Detail */}
                <Link
                  to={`/book/${favorite.book.ID}`}
                  className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
