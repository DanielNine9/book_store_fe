import React, { useState, useEffect } from "react";
import { X, Star, BookOpen, Clock, Award, Heart } from "lucide-react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

export function BookDetail() {
  const [book, setBook] = useState<any | null>(null);
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const { id } = useParams<{ id: string }>();

  // Lấy thông tin sách
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axiosInstance.get(`/books/${id}`);
        if (response.status === 200) {
          setBook(response.data);
          setIsFavorite(response.data.is_favorite); // Set trạng thái yêu thích khi có dữ liệu
        } else {
          console.error("Failed to fetch book details");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  // Xử lý khi nhấn nút yêu thích
  const toggleFavorite = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;

    try {
      if (isFavorite) {
        if (book.id_favorite) {
          // Remove from favorites
          await axiosInstance.delete(`/favorites/${book.id_favorite}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          setIsFavorite(false);
        }
      } else {
        const response = await axiosInstance.post(
          "/favorites/",
          {
            book_id: book.id,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        book.id_favorite = response.data.favorite;
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error while toggling favorite:", error);
    }
  };

  if (!book) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      {/* Book Details Header */}
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center border-b pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {book.title}
          </h1>
          <button
            onClick={() => window.history.back()}
            className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 text-lg"
          >
            <X className="w-5 h-5" /> Quay lại
          </button>
        </div>
        <div className="flex justify-end">
          <button
            onClick={toggleFavorite}
            className={`p-2 rounded-full shadow hover:bg-gray-100 ${
              isFavorite ? "text-red-500" : "text-gray-600"
            }`}
          >
            <Heart className="h-6 w-6" />
          </button>
        </div>
        {/* Book Image and Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {/* Book Image */}
            <div className="aspect-[3/4] rounded-lg overflow-hidden">
              <img
                src={
                  book.categories?.[0]?.image_url || "path/to/default-image.jpg"
                }
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Additional Book Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <BookOpen className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {book.description || "No description available"}
                </p>
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

          {/* Right Side: Book Info */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-indigo-600 font-medium">
                {book.categories?.[0]?.name}
              </span>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  (150 đánh giá)
                </span>
              </div>
            </div>
            <p className="text-lg text-gray-600">
              Tác giả: {book.author?.name}
            </p>
            <h3 className="text-xl font-semibold">Giới thiệu sách</h3>
            <p className="text-gray-600 leading-relaxed">
              {book.description || "No description available for this book."}
            </p>

            {/* Book Details */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold">Thông tin chi tiết</h3>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div>
                  <p className="text-sm text-gray-600">Nhà xuất bản</p>
                  <p className="font-medium">{book.publisher || "NXB Trẻ"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Năm xuất bản</p>
                  <p className="font-medium">{book.publish_year || "2024"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số trang</p>
                  <p className="font-medium">{book.pages || "300"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngôn ngữ</p>
                  <p className="font-medium">{book.language || "Tiếng Việt"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Section */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-indigo-600">
                {book.price} VND
              </p>
              <p className="text-sm text-gray-600">Đã bao gồm thuế</p>
            </div>
            <button className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Button */}
    </div>
  );
}
