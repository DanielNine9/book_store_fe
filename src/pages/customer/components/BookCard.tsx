import React, { useState, useEffect } from "react";
import { Heart, ShoppingCart, BookOpen, User, Tag } from "lucide-react";
import { Book } from "../../../types";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-hot-toast";
import { CustomToast } from "../../../components/Toast";

interface BookCardProps {
  book: any;
  onViewDetail: (book: Book) => void;
  refetch: () => void;
}

export function BookCard({ book, onViewDetail, refetch }: BookCardProps) {
  const [favoriteId, setFavoriteId] = useState<number>(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const bookImage = book.images?.[0]?.url || "https://via.placeholder.com/400x500";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

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
   
         toast.custom((t) => (
                  <CustomToast
                    t={t}
                    message={`Đã xóa khỏi danh sách yêu thích`}
                    type="success"
                  />
                ));
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
        toast.custom((t) => (
          <CustomToast
            t={t}
            message={"Đã thêm vào danh sách yêu thích"}
            type="success"
          />
        ));
      }
      await refetch();
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
      console.error("Error:", error);
    }
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
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
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    setFavoriteId(book.id_favorite);
  }, [book]);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={bookImage}
          alt={book.title}
          className="w-full h-[300px] object-cover transform group-hover:scale-105 transition-transform duration-300"
          onClick={() => onViewDetail(book)}
        />
        <button
          className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full 
            shadow-sm hover:shadow-md transition-all duration-200 
            ${favoriteId > 0 ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
          onClick={toggleFavorite}
        >
          <Heart className={`h-5 w-5 ${favoriteId > 0 ? "fill-current" : ""}`} />
        </button>
        
        {book.quantity_in_stock <= 5 && book.quantity_in_stock > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
            Chỉ còn {book.quantity_in_stock} cuốn
          </div>
        )}
        
        {book.quantity_in_stock === 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
            Hết hàng
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {book.categories?.map((category: any, index: number) => (
            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              <Tag className="w-3 h-3 mr-1" />
              {category.name}
            </span>
          ))}
        </div>

        <h3
          className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors duration-200 cursor-pointer line-clamp-2 mb-2"
          onClick={() => onViewDetail(book)}
        >
          {book.title}
        </h3>

        <div className="flex items-center text-gray-600 mb-3">
          <User className="h-4 w-4 mr-1" />
          <p className="text-sm">{book.author?.name || "Chưa có tác giả"}</p>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">Giá bán</span>
            <span className="text-lg font-bold text-indigo-600">
              {book.price ? formatPrice(book.price) : "Miễn phí"}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="p-2 text-indigo-600 hover:text-indigo-700 border border-indigo-600 rounded-lg transition-colors duration-200"
              onClick={() => onViewDetail(book)}
              title="Xem chi tiết"
            >
              <BookOpen className="h-5 w-5" />
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-200
                ${book.quantity_in_stock === 0 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700"}`}
              onClick={handleAddToCart}
              disabled={isAddingToCart || book.quantity_in_stock === 0}
            >
              <ShoppingCart className={`h-5 w-5 ${isAddingToCart ? "animate-bounce" : ""}`} />
              {isAddingToCart ? "..." : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}