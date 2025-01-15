import React, { useState, useEffect } from "react";
import {
  X,
  Star,
  BookOpen,
  Clock,
  Award,
  Heart,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";
import { CustomToast } from "../../components/Toast";
import toast from "react-hot-toast";

export function BookDetail() {
  const [book, setBook] = useState<any | null>(null);
  const [favoriteId, setFavoriteId] = useState<number>(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = user?.token;
    const fetchBookDetails = async () => {
      try {
        const response = await axiosInstance.get(`/books/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }});
        if (response.status === 200) {
          setBook(response.data);
          setFavoriteId(response.data.id_favorite);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const toggleFavorite = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;
    try {
      if (favoriteId > 0) {
        await axiosInstance.delete(`/favorites/${favoriteId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setFavoriteId(0);
      } else {
        const response = await axiosInstance.post(
          "/favorites/",
          { book_id: book.id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavoriteId(response.data.favorite);
      }
    } catch (error) {
      console.error("Error while toggling favorite:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.post(`/purchases/${book.id}`, {
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


  if (!book) return null;

  const nextImage = () => {
    if (book?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === book.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (book?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? book.images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 md:px-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 line-clamp-1">
            {book.title}
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full shadow-md hover:shadow-lg transition-all ${
                favoriteId > 0 ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-600"
              }`}
            >
              <Heart className={`h-6 w-6 ${favoriteId > 0 ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={() => window.history.back()}
              className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 text-lg"
            >
              <X className="w-5 h-5" /> Quay lại
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg">
              <img
                src={book?.images?.[currentImageIndex]?.url || "https://via.placeholder.com/600x800"}
                alt={book.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <button
                  onClick={prevImage}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-800" />
                </button>
                <button
                  onClick={nextImage}
                  className="p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all"
                >
                  <ChevronRight className="h-6 w-6 text-gray-800" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {book?.images?.map((image: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                    currentImageIndex === index ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`${book.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Book Information */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-600 font-medium">
                  {book.categories?.map((cat: any) => cat.name).join(", ")}
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

              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-indigo-600">
                  {book.price.toLocaleString()} VND
                </p>
                <span className="text-sm text-gray-500">
                  Còn lại: {book.quantity_in_stock} cuốn
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={book.quantity_in_stock === 0}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-white text-lg font-semibold transition-all ${
                  book.quantity_in_stock > 0
                    ? "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                {book.quantity_in_stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <BookOpen className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {book.book_detail?.pages || "N/A"} trang
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

            {/* Book Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Tác giả</h3>
                <p className="text-gray-700">{book.author?.name}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Giới thiệu sách</h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description || "Chưa có mô tả cho cuốn sách này."}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Thông tin chi tiết</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Nhà xuất bản</p>
                    <p className="font-medium">{book.book_detail?.publisher || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Năm xuất bản</p>
                    <p className="font-medium">{book.book_detail?.publication_year || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Kích thước</p>
                    <p className="font-medium">{book.book_detail?.dimensions || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Loại bìa</p>
                    <p className="font-medium">{book.book_detail?.binding_type || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Số trang</p>
                    <p className="font-medium">{book.book_detail?.pages || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Khối lượng</p>
                    <p className="font-medium">
                      {book.book_detail?.weight ? `${book.book_detail.weight} kg` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}